-- Create security definer function to get current user role to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update RLS policies to allow super admin access to all stores
CREATE POLICY "Super admins can manage all stores" 
ON public.stores 
FOR ALL 
USING (public.get_current_user_role() = 'super_admin');

-- Update RLS policies to allow super admin access to all offers
CREATE POLICY "Super admins can manage all offers" 
ON public.offers 
FOR ALL 
USING (public.get_current_user_role() = 'super_admin');

-- Allow super admins to view all profiles
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'super_admin');

-- Allow super admins to manage all redemptions
CREATE POLICY "Super admins can manage all redemptions" 
ON public.redemptions 
FOR ALL 
USING (public.get_current_user_role() = 'super_admin');

-- Allow super admins to view all saved offers
CREATE POLICY "Super admins can view all saved offers" 
ON public.saved_offers 
FOR SELECT 
USING (public.get_current_user_role() = 'super_admin');