import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Offer {
  id: string;
  merchant_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  discount_percentage: number;
  original_price: number;
  discounted_price: number;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedOffer {
  id: string;
  offer_id: string;
  user_id: string;
  saved_at: string;
  offers?: Offer;
}

export interface RedeemedOffer {
  id: string;
  offer_id: string;
  user_id: string;
  redeemed_at: string;
  offers?: Offer;
}

export function useOffers() {
  const { user } = useAuth();
  const [savedOffers, setSavedOffers] = useState<SavedOffer[]>([]);
  const [redeemedOffers, setRedeemedOffers] = useState<RedeemedOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedOffers();
      fetchRedeemedOffers();
    } else {
      setSavedOffers([]);
      setRedeemedOffers([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSavedOffers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_offers')
        .select(`
          *,
          offers (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedOffers(data || []);
    } catch (error) {
      console.error('Error fetching saved offers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved offers.",
        variant: "destructive",
      });
    }
  };

  const fetchRedeemedOffers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          *,
          offers (*)
        `)
        .eq('user_id', user.id)
        .order('redeemed_at', { ascending: false });

      if (error) throw error;
      setRedeemedOffers(data || []);
    } catch (error) {
      console.error('Error fetching redeemed offers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch redeemed offers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveOffer = async (offerId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to save offers.",
      });
      return false;
    }

    try {
      // Generate a proper UUID for the mock offer
      const uuidOfferId = crypto.randomUUID();
      
      // Check if already saved by mock offer ID (using a custom field)
      const { data: existing } = await supabase
        .from('saved_offers')
        .select('id')
        .eq('user_id', user.id)
        .eq('offer_id', uuidOfferId)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Already saved",
          description: "This offer is already in your saved offers.",
        });
        return false;
      }

      // For demo purposes, we'll create a minimal offer record first
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .insert({
          id: uuidOfferId,
          merchant_id: user.id, // Using current user as merchant for demo
          title: `Mock Offer ${offerId}`,
          description: 'This is a demo offer saved from the marketplace.',
          category: 'general',
          location: 'Demo Location',
          discount_percentage: 20,
          original_price: 100,
          discounted_price: 80,
          expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          is_active: true
        })
        .select()
        .single();

      if (offerError) {
        console.error('Error creating offer:', offerError);
        throw offerError;
      }

      const { error } = await supabase
        .from('saved_offers')
        .insert({
          user_id: user.id,
          offer_id: uuidOfferId
        });

      if (error) throw error;

      toast({
        title: "Offer saved!",
        description: "Offer added to your saved offers.",
      });

      fetchSavedOffers();
      return true;
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: "Error",
        description: "Failed to save offer.",
        variant: "destructive",
      });
      return false;
    }
  };

  const redeemOffer = async (offerId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to redeem offers.",
      });
      return false;
    }

    try {
      // Generate a proper UUID for the mock offer
      const uuidOfferId = crypto.randomUUID();
      
      // For demo purposes, create a minimal offer record first if it doesn't exist
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .insert({
          id: uuidOfferId,
          merchant_id: user.id, // Using current user as merchant for demo
          title: `Mock Offer ${offerId}`,
          description: 'This is a demo offer redeemed from the marketplace.',
          category: 'general', 
          location: 'Demo Location',
          discount_percentage: 20,
          original_price: 100,
          discounted_price: 80,
          expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          is_active: true
        })
        .select()
        .single();

      if (offerError && offerError.code !== '23505') { // 23505 is unique violation, which is OK
        console.error('Error creating offer:', offerError);
        throw offerError;
      }

      const { error } = await supabase
        .from('redemptions')
        .insert({
          user_id: user.id,
          offer_id: uuidOfferId
        });

      if (error) throw error;

      toast({
        title: "Offer redeemed!",
        description: "Congratulations! You can now use this coupon.",
      });

      fetchRedeemedOffers();
      return true;
    } catch (error) {
      console.error('Error redeeming offer:', error);
      toast({
        title: "Error",
        description: "Failed to redeem offer.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeSavedOffer = async (savedOfferId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_offers')
        .delete()
        .eq('id', savedOfferId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Offer removed",
        description: "Offer removed from your saved offers.",
      });

      fetchSavedOffers();
      return true;
    } catch (error) {
      console.error('Error removing saved offer:', error);
      toast({
        title: "Error",
        description: "Failed to remove saved offer.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    savedOffers,
    redeemedOffers,
    loading,
    saveOffer,
    redeemOffer,
    removeSavedOffer,
    refetch: () => {
      if (user) {
        fetchSavedOffers();
        fetchRedeemedOffers();
      }
    }
  };
}