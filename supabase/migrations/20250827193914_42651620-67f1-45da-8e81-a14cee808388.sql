-- Insert new categories that don't exist yet, ignoring duplicates
INSERT INTO public.categories (name, description, icon) VALUES
  ('all', 'View all categories', 'Grid'),
  ('travel', 'Travel and holiday deals', 'Plane'),
  ('health', 'Healthcare and wellness', 'Heartbeat'),
  ('beauty', 'Beauty and personal care', 'Sparkles'),
  ('education', 'Courses, training, and learning', 'BookOpen'),
  ('sports', 'Sports and fitness deals', 'Dumbbell'),
  ('entertainment', 'Movies, events, and fun activities', 'Clapperboard'),
  ('automotive', 'Cars, bikes, and accessories', 'Car'),
  ('kids_baby', 'Kids and baby products', 'Baby'),
  ('books', 'Books and stationery', 'Library'),
  ('services', 'Local and online services', 'Wrench'),
  ('pets', 'Pet products and services', 'Dog'),
  ('local_deals', 'Nearby stores and offers', 'MapPin'),
  ('online_deals', 'E-commerce and online discounts', 'Globe'),
  ('seasonal', 'Festival and seasonal offers', 'Gift')
ON CONFLICT (name) DO NOTHING;