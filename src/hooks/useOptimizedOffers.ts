import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OptimizedOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  district: string;
  city: string;
  original_price: number;
  discount_percentage: number;
  discounted_price: number;
  expiry_date: string;
  redemption_mode: 'online' | 'store' | 'both';
  listing_type: 'hot_offers' | 'trending' | 'local_deals';
  status: 'approved';
  is_active: boolean;
  created_at: string;
  merchant_id: string;
  store_name: string;
}

const OFFERS_PER_PAGE = 12;

// Query keys for caching
export const offerKeys = {
  all: ['offers'] as const,
  lists: () => [...offerKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...offerKeys.lists(), filters] as const,
  infinite: (filters: Record<string, any>) => [...offerKeys.all, 'infinite', filters] as const,
  byType: (type: string) => [...offerKeys.all, 'type', type] as const,
  byCategory: (category: string) => [...offerKeys.all, 'category', category] as const,
};

// Optimized query to fetch only necessary columns
export function useOptimizedOffers(filters: {
  type?: 'hot_offers' | 'trending' | 'local_deals';
  category?: string;
  city?: string;
  district?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: offerKeys.list(filters),
    queryFn: async () => {
      let query = supabase
        .from('offers')
        .select(`
          id, title, description, category, location, district, city,
          original_price, discount_percentage, discounted_price, expiry_date,
          redemption_mode, listing_type, status, is_active, created_at,
          merchant_id, store_name
        `)
        .eq('is_active', true)
        .eq('status', 'approved')
        .gte('expiry_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(OFFERS_PER_PAGE);

      // Apply filters
      if (filters.type) {
        query = query.eq('listing_type', filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.district) {
        query = query.eq('district', filters.district);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as OptimizedOffer[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Infinite scroll for better UX and reduced initial load
export function useInfiniteOffers(filters: {
  type?: 'hot_offers' | 'trending' | 'local_deals';
  category?: string;
  city?: string;
  district?: string;
  search?: string;
} = {}) {
  return useInfiniteQuery({
    queryKey: offerKeys.infinite(filters),
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('offers')
        .select(`
          id, title, description, category, location, district, city,
          original_price, discount_percentage, discounted_price, expiry_date,
          redemption_mode, listing_type, status, is_active, created_at,
          merchant_id, store_name
        `)
        .eq('is_active', true)
        .eq('status', 'approved')
        .gte('expiry_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .range(pageParam * OFFERS_PER_PAGE, (pageParam + 1) * OFFERS_PER_PAGE - 1);

      // Apply filters
      if (filters.type) {
        query = query.eq('listing_type', filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.district) {
        query = query.eq('district', filters.district);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return {
        data: data as OptimizedOffer[],
        nextPage: data.length === OFFERS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Optimized saved offers with selective fields
export function useSavedOffers() {
  return useQuery({
    queryKey: ['savedOffers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_offers')
        .select(`
          id, saved_at,
          offers!inner(
            id, title, description, category, location, district, city,
            original_price, discount_percentage, discounted_price, expiry_date,
            redemption_mode, listing_type, status, is_active, created_at,
            merchant_id, store_name
          )
        `)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for saved offers
  });
}

// Optimized redeemed offers
export function useRedeemedOffers() {
  return useQuery({
    queryKey: ['redeemedOffers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          id, status, redeemed_at,
          offers!inner(
            id, title, description, category, location, district, city,
            original_price, discount_percentage, discounted_price, expiry_date,
            redemption_mode, listing_type, status, is_active, created_at,
            merchant_id, store_name
          )
        `)
        .order('redeemed_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// Optimized mutation for saving offers
export function useSaveOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ offerId, userId }: { offerId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('saved_offers')
        .insert({ offer_id: offerId, user_id: userId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch saved offers
      queryClient.invalidateQueries({ queryKey: ['savedOffers'] });
    },
  });
}

// Optimized mutation for redeeming offers
export function useRedeemOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ offerId, userId }: { offerId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('redemptions')
        .insert({ offer_id: offerId, user_id: userId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['redeemedOffers'] });
      queryClient.invalidateQueries({ queryKey: ['savedOffers'] });
    },
  });
}