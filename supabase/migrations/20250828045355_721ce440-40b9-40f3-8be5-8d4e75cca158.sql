-- Create a security definer function to get profile stats
CREATE OR REPLACE FUNCTION public.get_profile_stats()
RETURNS TABLE(
  customer_count BIGINT,
  merchant_count BIGINT,
  total_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    COUNT(*) FILTER (WHERE role = 'customer') as customer_count,
    COUNT(*) FILTER (WHERE role = 'merchant') as merchant_count,
    COUNT(*) as total_count
  FROM public.profiles;
$$;