-- Add additional fields to profiles table for merchant and customer data
ALTER TABLE public.profiles 
ADD COLUMN phone_number text,
ADD COLUMN store_name text,
ADD COLUMN store_location text,
ADD COLUMN district text,
ADD COLUMN city text;

-- Update the handle_new_user function to store all signup form data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
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
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'),
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'store_name',
    NEW.raw_user_meta_data->>'store_location',
    NEW.raw_user_meta_data->>'district',
    NEW.raw_user_meta_data->>'city'
  );
  RETURN NEW;
END;
$$;