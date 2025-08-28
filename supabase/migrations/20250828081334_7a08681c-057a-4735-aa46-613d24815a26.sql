-- Remove the overly permissive public access policy
DROP POLICY IF EXISTS "Everyone can view active stores" ON public.stores;

-- Create a public view that only exposes non-sensitive store information
CREATE OR REPLACE VIEW public.stores_public AS
SELECT 
  id,
  name,
  description,
  location,
  district,
  city,
  is_active,
  created_at,
  updated_at
FROM public.stores
WHERE is_active = true;

-- Enable RLS on the view
ALTER VIEW public.stores_public SET (security_invoker = on);

-- Create policy for public view access
CREATE POLICY "Everyone can view public store info" 
ON public.stores_public 
FOR SELECT 
USING (true);

-- Create more restrictive policy for full store access
CREATE POLICY "Authenticated users can view stores they interact with" 
ON public.stores 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Super admins can see all
    get_current_user_role() = 'super_admin' OR
    -- Users can see stores they have saved offers from or redeemed offers from
    EXISTS (
      SELECT 1 FROM public.offers o 
      WHERE o.store_name = stores.name AND (
        EXISTS (SELECT 1 FROM public.saved_offers so WHERE so.offer_id = o.id AND so.user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.redemptions r WHERE r.offer_id = o.id AND r.user_id = auth.uid())
      )
    )
  )
);