-- Add district, city, and image_url columns to offers table
ALTER TABLE public.offers 
ADD COLUMN district text,
ADD COLUMN city text,
ADD COLUMN image_url text;