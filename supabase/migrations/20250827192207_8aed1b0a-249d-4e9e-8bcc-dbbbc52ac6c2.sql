-- Create categories table for offer categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- For storing lucide icon names
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stores table for store information
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  district TEXT,
  city TEXT,
  phone_number TEXT,
  email TEXT,
  website TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Everyone can view active categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories" 
ON public.categories 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for stores  
CREATE POLICY "Everyone can view active stores" 
ON public.stores 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage stores" 
ON public.stores 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, description, icon) VALUES
  ('electronics', 'Electronics and gadgets', 'Smartphone'),
  ('fashion', 'Clothing and accessories', 'Shirt'),
  ('food', 'Food and beverages', 'UtensilsCrossed'),
  ('grocery', 'Grocery and daily essentials', 'ShoppingCart'),
  ('home', 'Home and garden', 'Home'),
  ('other', 'Other categories', 'Package');

-- Insert some sample stores (you can customize these)
INSERT INTO public.stores (name, description, location, district, city, phone_number) VALUES
  ('Local Electronics Store', 'Best electronics deals in town', 'Main Street 123', 'Erode', 'Sathyamangalam', '+91 9876543210'),
  ('Fashion Hub', 'Trendy clothes and accessories', 'Shopping Complex', 'Erode', 'Sathyamangalam', '+91 9876543211'),
  ('Fresh Foods Market', 'Fresh groceries and food items', 'Market Street', 'Erode', 'Sathyamangalam', '+91 9876543212');