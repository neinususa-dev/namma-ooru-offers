-- Add Neinus Technologies to stores table
INSERT INTO public.stores (
  name,
  description,
  location,
  district,
  city,
  phone_number,
  email,
  website,
  is_active
) VALUES (
  'Neinus Technologies',
  'Leading technology solutions provider offering innovative software development, web design, and digital marketing services',
  'IT Park, Phase 1',
  'Chennai',
  'Chennai City',
  '+91-9876543210',
  'info@neinustech.com',
  'https://neinustech.com',
  true
) ON CONFLICT (name) DO NOTHING;

-- Update the handle_new_user function to automatically create store entries for merchants
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role public.user_role;
BEGIN
  -- Get the user role
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer');
  
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
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    NEW.email,
    user_role,
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'store_name',
    NEW.raw_user_meta_data->>'store_location',
    NEW.raw_user_meta_data->>'district',
    NEW.raw_user_meta_data->>'city'
  );
  
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
      CONCAT('Store owned by ', COALESCE(NEW.raw_user_meta_data->>'name', 'Merchant')),
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