-- Drop and recreate the stores_public view to fix the issue
DROP VIEW IF EXISTS public.stores_public;

-- Create a proper stores_public view
CREATE VIEW public.stores_public AS
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