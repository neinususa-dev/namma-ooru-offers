-- Fix the security definer view issue by explicitly setting SECURITY INVOKER
DROP VIEW IF EXISTS public.stores_public;

-- Create the stores_public view with explicit SECURITY INVOKER
CREATE VIEW public.stores_public 
WITH (security_invoker = true)
AS
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