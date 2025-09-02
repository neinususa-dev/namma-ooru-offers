import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseOffer {
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
  status: 'applied' | 'in_review' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  merchant_id: string;
  merchant_name?: string;
}

export function useOfferDatabase() {
  const [offers, setOffers] = useState<DatabaseOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Optimized query with pagination and simplified joins
      const { data, error: fetchError } = await supabase
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
        .limit(50); // Add pagination limit

      if (fetchError) {
        throw fetchError;
      }

      // Get merchant names in a separate optimized query
      const merchantIds = [...new Set((data || []).map(offer => offer.merchant_id))];
      const { data: merchants } = await supabase
        .from('profiles')
        .select('id, name, store_name')
        .in('id', merchantIds);

      const merchantMap = new Map(merchants?.map(m => [m.id, m]) || []);

      const offersWithMerchantNames = (data || []).map(offer => {
        const merchant = merchantMap.get(offer.merchant_id);
        const merchantName = merchant?.store_name || merchant?.name || offer.store_name || 'Local Merchant';
        return {
          ...offer,
          merchant_name: merchantName
        };
      });
      
      setOffers(offersWithMerchantNames as DatabaseOffer[]);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const getOffersByType = (type: 'hot_offers' | 'trending' | 'local_deals') => {
    return offers.filter(offer => offer.listing_type === type);
  };

  const getOffersByCategory = (category: string) => {
    if (category === 'all') return offers;
    return offers.filter(offer => offer.category === category);
  };

  const searchOffers = (query: string) => {
    if (!query.trim()) return offers;
    
    const searchTerm = query.toLowerCase();
    return offers.filter(offer => 
      offer.title.toLowerCase().includes(searchTerm) ||
      offer.description.toLowerCase().includes(searchTerm) ||
      offer.location.toLowerCase().includes(searchTerm) ||
      offer.category.toLowerCase().includes(searchTerm)
    );
  };

  const refetch = () => {
    fetchOffers();
  };

  return {
    offers,
    loading,
    error,
    getOffersByType,
    getOffersByCategory,
    searchOffers,
    refetch
  };
}