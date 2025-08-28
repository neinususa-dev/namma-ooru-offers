-- Fix the security definer view issue by recreating as security invoker
DROP VIEW IF EXISTS public.stores_public;

-- Create a security invoker view that only exposes non-sensitive store information
CREATE VIEW public.stores_public WITH (security_invoker = true) AS
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

-- Grant public access to the view
GRANT SELECT ON public.stores_public TO anon;
GRANT SELECT ON public.stores_public TO authenticated;