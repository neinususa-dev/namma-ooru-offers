-- Allow everyone to view active stores (this will make stores_public accessible to anonymous users)
CREATE POLICY "Everyone can view active stores" 
ON public.stores 
FOR SELECT 
TO anon, authenticated
USING (is_active = true);