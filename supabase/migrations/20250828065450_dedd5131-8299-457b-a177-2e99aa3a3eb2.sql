-- Add super_admin to user_role enum
ALTER TYPE public.user_role ADD VALUE 'super_admin';

-- Update RLS policies to allow super admin access to all stores
CREATE POLICY "Super admins can manage all stores" 
ON public.stores 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Update RLS policies to allow super admin access to all offers
CREATE POLICY "Super admins can manage all offers" 
ON public.offers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Allow super admins to view all profiles
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
);

-- Allow super admins to manage all redemptions
CREATE POLICY "Super admins can manage all redemptions" 
ON public.redemptions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Allow super admins to view all saved offers
CREATE POLICY "Super admins can view all saved offers" 
ON public.saved_offers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);