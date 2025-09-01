-- Add is_active column to profiles table for enabling/disabling users
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Add updated_at trigger for profiles table if not exists
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_profiles_updated_at_trigger ON public.profiles;
CREATE TRIGGER update_profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();

-- Update RLS policies to prevent disabled users from accessing their data
DROP POLICY IF EXISTS "Disabled users cannot access their profile" ON public.profiles;
CREATE POLICY "Disabled users cannot access their profile"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id AND is_active = true)
WITH CHECK (auth.uid() = id AND is_active = true);