-- Fix function search path security issues
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Fix function search path security issues
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';