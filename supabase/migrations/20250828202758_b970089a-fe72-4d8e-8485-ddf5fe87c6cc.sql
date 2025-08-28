-- Prevent super admins from creating stores
DROP POLICY IF EXISTS "Authenticated users can manage stores" ON public.stores;

-- Create new policy that excludes super admins from creating stores
CREATE POLICY "Non-super-admin users can create stores" 
ON public.stores 
FOR INSERT 
TO authenticated
WITH CHECK (get_current_user_role() != 'super_admin');

-- Allow super admins to update all stores
CREATE POLICY "Super admins can update all stores" 
ON public.stores 
FOR UPDATE
TO authenticated
USING (get_current_user_role() = 'super_admin');

-- Allow super admins to delete all stores
CREATE POLICY "Super admins can delete all stores" 
ON public.stores 
FOR DELETE
TO authenticated
USING (get_current_user_role() = 'super_admin');

-- Update stores_public view to exclude super admin stores
DROP VIEW IF EXISTS public.stores_public;

CREATE VIEW public.stores_public AS
SELECT 
  s.id,
  s.name,
  s.description,
  s.location,
  s.district,
  s.city,
  s.is_active,
  s.created_at,
  s.updated_at
FROM public.stores s
LEFT JOIN public.profiles p ON p.store_name = s.name
WHERE s.is_active = true 
  AND (p.role != 'super_admin' OR p.role IS NULL);

-- Grant permissions on the updated view
GRANT SELECT ON public.stores_public TO anon, authenticated;

-- Prevent super admins from saving offers
DROP POLICY IF EXISTS "Users can manage their own saved offers" ON public.saved_offers;

CREATE POLICY "Non-super-admin users can manage saved offers" 
ON public.saved_offers 
FOR ALL
TO authenticated
USING (auth.uid() = user_id AND get_current_user_role() != 'super_admin')
WITH CHECK (auth.uid() = user_id AND get_current_user_role() != 'super_admin');

-- Prevent super admins from redeeming offers
DROP POLICY IF EXISTS "Users can create their own redemptions" ON public.redemptions;

CREATE POLICY "Non-super-admin users can create redemptions" 
ON public.redemptions 
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND get_current_user_role() != 'super_admin');

-- Prevent super admins from viewing their own redemptions (they shouldn't have any)
DROP POLICY IF EXISTS "Users can view their own redemptions" ON public.redemptions;

CREATE POLICY "Non-super-admin users can view their own redemptions" 
ON public.redemptions 
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND get_current_user_role() != 'super_admin');

-- Prevent super admins from participating in reward system
DROP POLICY IF EXISTS "Users can view their own rewards" ON public.user_rewards;
DROP POLICY IF EXISTS "Users can update their own rewards" ON public.user_rewards;

CREATE POLICY "Non-super-admin users can view their own rewards" 
ON public.user_rewards 
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND get_current_user_role() != 'super_admin');

CREATE POLICY "Non-super-admin users can update their own rewards" 
ON public.user_rewards 
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND get_current_user_role() != 'super_admin');

-- Prevent super admins from redeeming reward offers
DROP POLICY IF EXISTS "Users can create their own redemptions" ON public.reward_redemptions;
DROP POLICY IF EXISTS "Users can view their own redemptions" ON public.reward_redemptions;

CREATE POLICY "Non-super-admin users can create reward redemptions" 
ON public.reward_redemptions 
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND get_current_user_role() != 'super_admin');

CREATE POLICY "Non-super-admin users can view their own reward redemptions" 
ON public.reward_redemptions 
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND get_current_user_role() != 'super_admin');

-- Prevent super admins from viewing reward activities as regular users
DROP POLICY IF EXISTS "Users can view their own activities" ON public.reward_activities;

CREATE POLICY "Non-super-admin users can view their own activities" 
ON public.reward_activities 
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND get_current_user_role() != 'super_admin');