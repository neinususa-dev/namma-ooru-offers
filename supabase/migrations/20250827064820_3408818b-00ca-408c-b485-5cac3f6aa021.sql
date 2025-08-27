-- Add store_name column to offers table
ALTER TABLE public.offers 
ADD COLUMN store_name text;