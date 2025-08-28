-- Fix the security warning by setting search path
CREATE OR REPLACE FUNCTION public.get_profile_stats()
RETURNS TABLE(
  customer_count BIGINT,
  merchant_count BIGINT,
  total_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    COUNT(*) FILTER (WHERE role = 'customer') as customer_count,
    COUNT(*) FILTER (WHERE role = 'merchant') as merchant_count,
    COUNT(*) as total_count
  FROM public.profiles;
$$;