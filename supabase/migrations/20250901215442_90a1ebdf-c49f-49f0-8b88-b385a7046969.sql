-- Allow super admins to update any profile
CREATE POLICY "Super admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (get_current_user_role() = 'super_admin'::text);