-- Create user_rewards table to track points and referral codes
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_points INTEGER NOT NULL DEFAULT 0,
  total_earned_points INTEGER NOT NULL DEFAULT 0,
  total_redeemed_points INTEGER NOT NULL DEFAULT 0,
  level_name TEXT NOT NULL DEFAULT 'Bronze',
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create reward_activities table to log all points activities
CREATE TABLE public.reward_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('registration_bonus', 'referral_bonus', 'qr_scan', 'offer_redeem', 'points_redeem')),
  points INTEGER NOT NULL,
  reference_id UUID NULL, -- offer_id, referral_id, etc.
  reference_type TEXT NULL, -- 'offer', 'referral', 'store', etc.
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table to track referral relationships
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 25,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referred_id) -- A user can only be referred once
);

-- Create reward_offers table for point-based offers
CREATE TABLE public.reward_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  image_url TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_redemptions INTEGER NULL, -- NULL means unlimited
  current_redemptions INTEGER NOT NULL DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reward_redemptions table to track point-based offer redemptions
CREATE TABLE public.reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_offer_id UUID NOT NULL REFERENCES public.reward_offers(id) ON DELETE CASCADE,
  points_used INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add points_required column to existing offers table
ALTER TABLE public.offers ADD COLUMN points_required INTEGER NULL;

-- Enable Row Level Security
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_rewards
CREATE POLICY "Users can view their own rewards" 
ON public.user_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" 
ON public.user_rewards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert user rewards" 
ON public.user_rewards 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for reward_activities
CREATE POLICY "Users can view their own activities" 
ON public.reward_activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert activities" 
ON public.reward_activities 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for referrals
CREATE POLICY "Users can view referrals they made or received" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can manage referrals" 
ON public.referrals 
FOR ALL 
USING (true);

-- RLS Policies for reward_offers
CREATE POLICY "Everyone can view active reward offers" 
ON public.reward_offers 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage reward offers" 
ON public.reward_offers 
FOR ALL 
USING (true);

-- RLS Policies for reward_redemptions
CREATE POLICY "Users can view their own redemptions" 
ON public.reward_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" 
ON public.reward_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_rewards_user_id ON public.user_rewards(user_id);
CREATE INDEX idx_reward_activities_user_id ON public.reward_activities(user_id);
CREATE INDEX idx_reward_activities_created_at ON public.reward_activities(created_at DESC);
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_reward_offers_active ON public.reward_offers(is_active);
CREATE INDEX idx_reward_redemptions_user_id ON public.reward_redemptions(user_id);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INTEGER := 1;
BEGIN
  -- Create base code from first 3 letters of name + random 3 digits
  base_code := UPPER(LEFT(REGEXP_REPLACE(user_name, '[^A-Za-z]', '', 'g'), 3)) || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
  final_code := base_code;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.user_rewards WHERE referral_code = final_code) LOOP
    final_code := base_code || counter::TEXT;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- Function to award points
CREATE OR REPLACE FUNCTION public.award_points(
  target_user_id UUID,
  points_amount INTEGER,
  activity_type TEXT,
  activity_description TEXT,
  reference_id UUID DEFAULT NULL,
  reference_type TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update user rewards
  UPDATE public.user_rewards 
  SET 
    current_points = current_points + points_amount,
    total_earned_points = total_earned_points + GREATEST(points_amount, 0),
    total_redeemed_points = total_redeemed_points + GREATEST(-points_amount, 0),
    updated_at = now()
  WHERE user_id = target_user_id;
  
  -- Log activity
  INSERT INTO public.reward_activities (
    user_id, 
    activity_type, 
    points, 
    reference_id, 
    reference_type, 
    description
  ) VALUES (
    target_user_id, 
    activity_type, 
    points_amount, 
    reference_id, 
    reference_type, 
    activity_description
  );
  
  -- Update user level based on total earned points
  UPDATE public.user_rewards 
  SET level_name = CASE 
    WHEN total_earned_points >= 1000 THEN 'Platinum'
    WHEN total_earned_points >= 500 THEN 'Gold'
    WHEN total_earned_points >= 200 THEN 'Silver'
    ELSE 'Bronze'
  END
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Update handle_new_user function to create rewards profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
  user_role public.user_role;
  user_name TEXT;
  ref_code TEXT;
  referrer_user_id UUID;
BEGIN
  -- Get the user role and name
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer');
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', 'User');
  ref_code := NEW.raw_user_meta_data->>'referral_code';
  
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    role,
    phone_number,
    store_name,
    store_location,
    district,
    city
  )
  VALUES (
    NEW.id, 
    user_name, 
    NEW.email,
    user_role,
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'store_name',
    NEW.raw_user_meta_data->>'store_location',
    NEW.raw_user_meta_data->>'district',
    NEW.raw_user_meta_data->>'city'
  );
  
  -- Create user rewards profile with unique referral code
  INSERT INTO public.user_rewards (
    user_id,
    referral_code
  ) VALUES (
    NEW.id,
    public.generate_referral_code(user_name)
  );
  
  -- Award registration bonus (50 points)
  PERFORM public.award_points(
    NEW.id,
    50,
    'registration_bonus',
    'Welcome bonus for joining Namma Ooru Offers!'
  );
  
  -- Handle referral if referral code was provided
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    -- Find the referrer
    SELECT user_id INTO referrer_user_id 
    FROM public.user_rewards 
    WHERE referral_code = ref_code;
    
    IF referrer_user_id IS NOT NULL THEN
      -- Create referral record
      INSERT INTO public.referrals (
        referrer_id,
        referred_id,
        referral_code,
        points_awarded
      ) VALUES (
        referrer_user_id,
        NEW.id,
        ref_code,
        25
      );
      
      -- Award referral bonus to referrer (25 points)
      PERFORM public.award_points(
        referrer_user_id,
        25,
        'referral_bonus',
        'Referral bonus for inviting ' || user_name,
        NEW.id,
        'referral'
      );
    END IF;
  END IF;
  
  -- If user is a merchant and has store information, create store entry
  IF user_role = 'merchant' AND NEW.raw_user_meta_data->>'store_name' IS NOT NULL THEN
    INSERT INTO public.stores (
      name,
      description,
      location,
      district,
      city,
      phone_number,
      email,
      is_active
    )
    VALUES (
      NEW.raw_user_meta_data->>'store_name',
      CONCAT('Store owned by ', user_name),
      NEW.raw_user_meta_data->>'store_location',
      NEW.raw_user_meta_data->>'district',
      NEW.raw_user_meta_data->>'city',
      NEW.raw_user_meta_data->>'phone_number',
      NEW.email,
      true
    )
    ON CONFLICT (name) DO UPDATE SET
      description = EXCLUDED.description,
      location = EXCLUDED.location,
      district = EXCLUDED.district,
      city = EXCLUDED.city,
      phone_number = EXCLUDED.phone_number,
      email = EXCLUDED.email,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_rewards_updated_at
  BEFORE UPDATE ON public.user_rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reward_offers_updated_at
  BEFORE UPDATE ON public.reward_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample reward offers
INSERT INTO public.reward_offers (title, description, points_required, image_url) VALUES
('Free Coffee Voucher', 'Redeem a free coffee at participating cafes', 100, null),
('₹50 Shopping Discount', 'Get ₹50 off on your next purchase', 200, null),
('Movie Ticket Discount', '20% off on movie tickets', 300, null),
('Restaurant Meal Deal', 'Free appetizer with main course', 400, null),
('₹100 Cashback Voucher', 'Instant cashback on your purchase', 500, null);