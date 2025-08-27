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

      const { data, error: fetchError } = await supabase
        .from('offers')
        .select(`
          *,
          profiles(name, store_name)
        `)
        .eq('is_active', true)
        .gte('expiry_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const offersWithMerchantNames = (data || []).map(offer => {
        const merchantName = offer.profiles?.store_name || offer.profiles?.name || offer.store_name || 'Local Merchant';
        console.log('Processing offer:', offer.title, 'profiles:', offer.profiles, 'store_name from offers:', offer.store_name, 'final merchant_name:', merchantName);
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