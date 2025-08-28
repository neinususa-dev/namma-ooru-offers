-- Grant SELECT permission on stores_public view to anonymous users
GRANT SELECT ON public.stores_public TO anon;
GRANT SELECT ON public.stores_public TO authenticated;