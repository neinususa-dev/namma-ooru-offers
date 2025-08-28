-- Ensure the stores_public view has proper RLS configuration
-- First check if RLS is enabled on the view
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'stores_public';

-- Check if it's a view (views don't have RLS by default)
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'stores_public';

-- Add a policy to make the view publicly accessible (if needed)
-- Views inherit permissions from underlying tables, but we can add explicit policies
DO $$
BEGIN
    -- Enable RLS on the view if it exists as a table (shouldn't be needed for views)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'stores_public') THEN
        ALTER TABLE public.stores_public ENABLE ROW LEVEL SECURITY;
        
        -- Create a policy to allow public access
        CREATE POLICY IF NOT EXISTS "Public stores are viewable by everyone" 
        ON public.stores_public 
        FOR SELECT 
        USING (true);
    END IF;
END $$;