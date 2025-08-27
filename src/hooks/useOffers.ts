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

  const saveOffer = async (offerId: string, offerData?: any) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to save offers.",
      });
      return false;
    }

    try {
      // Create a consistent offer identifier based on the original offer data
      const offerIdentifier = `${offerData?.shopName || 'shop'}-${offerData?.offerTitle || offerId}`.toLowerCase().replace(/\s+/g, '-');
      
      // Check if this specific offer is already saved by this user
      const { data: existingOffers } = await supabase
        .from('offers')
        .select('id, saved_offers!inner(*)')
        .eq('saved_offers.user_id', user.id)
        .ilike('title', `%${offerData?.offerTitle || offerId}%`)
        .limit(1);

      if (existingOffers && existingOffers.length > 0) {
        toast({
          title: "Already saved",
          description: "This offer is already in your saved offers.",
        });
        return false;
      }

      // Generate a proper UUID for the new offer
      const uuidOfferId = crypto.randomUUID();

      // Create offer record using actual offer data
      const discountValue = offerData?.discount ? 
        parseInt(offerData.discount.replace(/[^\d]/g, '')) || 20 : 20;
      
      const { data: createdOffer, error: offerError } = await supabase
        .from('offers')
        .insert({
          id: uuidOfferId,
          merchant_id: user.id, // Using current user as merchant for demo
          title: offerData?.offerTitle || `Offer ${offerId}`,
          description: offerData?.description || `Special offer from ${profile?.store_name || profile?.name || 'our store'}.`,
          category: offerData?.category || 'general',
          location: offerData?.location || 'Local Area',
          discount_percentage: discountValue,
          original_price: 100,
          discounted_price: Math.max(100 - discountValue, 10),
          expiry_date: offerData?.expiryDate ? 
            new Date(offerData.expiryDate).toISOString() : 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
      // Get user profile to check if they're premium
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role, store_name, name')
        .eq('id', user.id)
        .single();

      const isPremium = userProfile?.role === 'merchant'; // Only merchants have unlimited redemptions

      // If offerId is a UUID (from saved offers), use it directly. Otherwise, create a new one
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(offerId);
      let actualOfferId = offerId;

      if (!isUUID) {
        // Generate a proper UUID for the mock offer
        actualOfferId = crypto.randomUUID();
        
        // For demo purposes, create a minimal offer record first if it doesn't exist
        const { data: offerData, error: offerError } = await supabase
          .from('offers')
          .insert({
            id: actualOfferId,
            merchant_id: user.id, // Using current user as merchant for demo
            title: `Mock Offer ${offerId}`,
            description: `This is a demo offer redeemed from ${userProfile?.store_name || userProfile?.name || 'our store'}.`,
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
      }

      // Check if already redeemed (only for free users)
      if (!isPremium) {
        const { data: existing } = await supabase
          .from('redemptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('offer_id', actualOfferId)
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
        const { data: offerDetails } = await supabase
          .from('offers')
          .select('title')
          .eq('id', actualOfferId)
          .single();

        if (offerDetails?.title) {
          const { data: similarRedemptions } = await supabase
            .from('redemptions')
            .select('id, offers!inner(title)')
            .eq('user_id', user.id)
            .ilike('offers.title', `%${offerDetails.title.split(' ')[0]}%`)
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

      // Add to redemptions
      const { error } = await supabase
        .from('redemptions')
        .insert({
          user_id: user.id,
          offer_id: actualOfferId
        });

      if (error) throw error;

      // If this was redeemed from saved offers, remove it from saved offers
      if (isUUID) {
        const { error: removeError } = await supabase
          .from('saved_offers')
          .delete()
          .eq('user_id', user.id)
          .eq('offer_id', actualOfferId);

        if (removeError) {
          console.error('Error removing from saved offers:', removeError);
          // Don't throw error here, redemption was successful
        }
      }

      toast({
        title: "Offer redeemed!",
        description: "Congratulations! You can now use this coupon.",
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