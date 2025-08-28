-- Create a function to check if a phone number already exists
-- This function uses SECURITY DEFINER to bypass RLS and check for existing phone numbers
CREATE OR REPLACE FUNCTION public.phone_exists(phone_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE phone_number = phone_to_check
  );
END;
$$;