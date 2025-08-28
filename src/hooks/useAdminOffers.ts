import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminOffer {
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
  store_name?: string;
  image_url?: string;
}

export function useAdminOffers() {
  const [offers, setOffers] = useState<AdminOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('offers')
        .select(`
          *,
          profiles!merchant_id(name, store_name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const offersWithMerchantNames = (data || []).map(offer => {
        const merchantName = offer.profiles?.store_name || offer.profiles?.name || offer.store_name || 'Local Merchant';
        return {
          ...offer,
          merchant_name: merchantName
        };
      });
      
      setOffers(offersWithMerchantNames as AdminOffer[]);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const updateOfferStatus = async (offerId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: `Offer has been ${status}.`,
      });

      // Refresh offers list
      fetchAllOffers();
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update offer status.',
        variant: 'destructive',
      });
    }
  };

  const updateOffer = async (offerId: string, updates: Partial<AdminOffer>) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update(updates)
        .eq('id', offerId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Offer has been updated.',
      });

      // Refresh offers list
      fetchAllOffers();
    } catch (error) {
      console.error('Error updating offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to update offer.',
        variant: 'destructive',
      });
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Offer has been deleted.',
      });

      // Refresh offers list
      fetchAllOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete offer.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAllOffers();
  }, []);

  const getOffersByStatus = (status: string) => {
    if (status === 'all') return offers;
    return offers.filter(offer => offer.status === status);
  };

  return {
    offers,
    loading,
    error,
    updateOfferStatus,
    updateOffer,
    deleteOffer,
    getOffersByStatus,
    refetch: fetchAllOffers
  };
}