-- Create a function to check if an email already exists
-- This function uses SECURITY DEFINER to bypass RLS and check for existing emails
CREATE OR REPLACE FUNCTION public.email_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE lower(email) = lower(email_to_check)
  );
END;
$$;