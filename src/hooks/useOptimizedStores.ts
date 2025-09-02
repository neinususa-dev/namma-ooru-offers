import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OptimizedStore {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  district: string | null;
  city: string | null;
  is_active: boolean;
}

const STORES_PER_PAGE = 50;

export function useOptimizedStores(filters: {
  city?: string;
  district?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: async () => {
      let query = supabase
        .from('stores_public')
        .select('id, name, description, location, district, city, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true })
        .limit(STORES_PER_PAGE);

      // Apply filters
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.district) {
        query = query.eq('district', filters.district);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as OptimizedStore[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - stores don't change often
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}