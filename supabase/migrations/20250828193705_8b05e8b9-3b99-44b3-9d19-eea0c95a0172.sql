-- Fix the permissions issue for stores_public view
-- First, let's check the current permissions
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'stores_public';

-- Grant explicit permissions to the anon role for the view
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.stores_public TO anon;
GRANT SELECT ON public.stores_public TO authenticated;