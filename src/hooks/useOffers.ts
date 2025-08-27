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
  status: 'pending' | 'approved' | 'rejected';
  offers?: Offer;
}

export function useOffers() {
  const { user, profile } = useAuth();
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
      setRedeemedOffers((data || []) as RedeemedOffer[]);
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

  const saveOffer = async (offerId: string, offerData?: any) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to save offers.",
      });
      return false;
    }

    try {
      // Check if this offer is already saved by this user
      const { data: existingSave, error: checkError } = await supabase
        .from('saved_offers')
        .select('id')
        .eq('offer_id', offerId)
        .eq('user_id', user.id)
        .single();

      if (existingSave) {
        toast({
          title: "Already saved",
          description: "This offer is already in your saved offers.",
        });
        return false;
      }

      // Save the offer reference (not create a new offer)
      const { error: saveError } = await supabase
        .from('saved_offers')
        .insert({
          offer_id: offerId,
          user_id: user.id
        });

      if (saveError) {
        console.error('Error saving offer:', saveError);
        throw saveError;
      }

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
      // Get user profile to check if they're premium
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role, store_name, name')
        .eq('id', user.id)
        .single();

      const isPremium = userProfile?.role === 'merchant'; // Only merchants have unlimited redemptions

      // Validate that the offer exists and is active
      const { data: offerExists, error: validateError } = await supabase
        .from('offers')
        .select('id, title, is_active')
        .eq('id', offerId)
        .eq('is_active', true)
        .single();

      if (validateError || !offerExists) {
        toast({
          title: "Invalid offer",
          description: "This offer is no longer available or doesn't exist.",
          variant: "destructive",
        });
        return false;
      }

      // Check if already redeemed (only for free users)
      if (!isPremium) {
        const { data: existing } = await supabase
          .from('redemptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('offer_id', offerId)
          .maybeSingle();

        if (existing) {
          toast({
            title: "Already redeemed",
            description: "Customers can only redeem each offer once. Merchants have unlimited redemptions!",
            variant: "destructive",
          });
          return false;
        }

        // For free users, also check if they've redeemed a similar offer by title
        if (offerExists?.title) {
          const { data: similarRedemptions } = await supabase
            .from('redemptions')
            .select('id, offers!inner(title)')
            .eq('user_id', user.id)
            .ilike('offers.title', `%${offerExists.title.split(' ')[0]}%`)
            .limit(1);

          if (similarRedemptions && similarRedemptions.length > 0) {
            toast({
              title: "Similar offer already redeemed",
              description: "Customers can only redeem each type of offer once. Merchants have unlimited access!",
              variant: "destructive",
            });
            return false;
          }
        }
      }

      // Add to redemptions with pending status
      const { error } = await supabase
        .from('redemptions')
        .insert({
          user_id: user.id,
          offer_id: offerId,
          status: 'pending'
        });

      if (error) throw error;

      // Remove from saved offers if it was saved
      const { error: removeError } = await supabase
        .from('saved_offers')
        .delete()
        .eq('user_id', user.id)
        .eq('offer_id', offerId);

      if (removeError) {
        console.error('Error removing from saved offers:', removeError);
        // Don't throw error here, redemption was successful
      }

      toast({
        title: "Redemption Request Sent!",
        description: "Your redemption request is pending merchant approval.",
      });

      fetchRedeemedOffers();
      fetchSavedOffers(); // Refresh saved offers to reflect removal
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

  const approveRedemption = async (redemptionId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('redemptions')
        .update({ status: 'approved' })
        .eq('id', redemptionId);

      if (error) throw error;

      toast({
        title: "Redemption Approved",
        description: "Customer redemption has been approved.",
      });

      fetchRedeemedOffers();
      return true;
    } catch (error) {
      console.error('Error approving redemption:', error);
      toast({
        title: "Error",
        description: "Failed to approve redemption.",
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectRedemption = async (redemptionId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('redemptions')
        .update({ status: 'rejected' })
        .eq('id', redemptionId);

      if (error) throw error;

      toast({
        title: "Redemption Rejected",
        description: "Customer redemption has been rejected.",
      });

      fetchRedeemedOffers();
      return true;
    } catch (error) {
      console.error('Error rejecting redemption:', error);
      toast({
        title: "Error",
        description: "Failed to reject redemption.",
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
    approveRedemption,
    rejectRedemption,
    refetch: () => {
      if (user) {
        fetchSavedOffers();
        fetchRedeemedOffers();
      }
    }
  };
}