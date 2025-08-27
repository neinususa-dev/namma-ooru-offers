import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserReward {
  id: string;
  current_points: number;
  total_earned_points: number;
  total_redeemed_points: number;
  level_name: string;
  referral_code: string;
  created_at: string;
  updated_at: string;
}

export interface RewardActivity {
  id: string;
  activity_type: string;
  points: number;
  description: string;
  created_at: string;
  reference_id?: string;
  reference_type?: string;
}

export interface RewardOffer {
  id: string;
  title: string;
  description: string;
  points_required: number;
  image_url?: string;
  is_active: boolean;
  max_redemptions?: number;
  current_redemptions: number;
  expiry_date?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  points_awarded: number;
  status: string;
  created_at: string;
}

export const useRewards = () => {
  const { user } = useAuth();
  const [userReward, setUserReward] = useState<UserReward | null>(null);
  const [activities, setActivities] = useState<RewardActivity[]>([]);
  const [rewardOffers, setRewardOffers] = useState<RewardOffer[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user rewards data
  const fetchUserReward = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserReward(data);
    } catch (err) {
      console.error('Error fetching user reward:', err);
      setError('Failed to fetch reward data');
    }
  };

  // Fetch reward activities
  const fetchActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reward_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  // Fetch reward offers
  const fetchRewardOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('reward_offers')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;
      setRewardOffers(data || []);
    } catch (err) {
      console.error('Error fetching reward offers:', err);
    }
  };

  // Fetch referrals
  const fetchReferrals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:profiles!referrals_referrer_id_fkey(name),
          referred:profiles!referrals_referred_id_fkey(name)
        `)
        .or(`referrer_id.eq.${user.id},referred_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  // Redeem a reward offer
  const redeemRewardOffer = async (offerId: string, pointsRequired: number) => {
    if (!user || !userReward) return false;

    if (userReward.current_points < pointsRequired) {
      setError('Insufficient points');
      return false;
    }

    try {
      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_offer_id: offerId,
          points_used: pointsRequired
        });

      if (redemptionError) throw redemptionError;

      // Award negative points (deduction)
      const { error: pointsError } = await supabase.rpc('award_points', {
        target_user_id: user.id,
        points_amount: -pointsRequired,
        activity_type: 'points_redeem',
        activity_description: 'Redeemed reward offer',
        reference_id: offerId,
        reference_type: 'reward_offer'
      });

      if (pointsError) throw pointsError;

      // Update current redemptions count
      const { data: currentOffer } = await supabase
        .from('reward_offers')
        .select('current_redemptions')
        .eq('id', offerId)
        .single();

      if (currentOffer) {
        await supabase
          .from('reward_offers')
          .update({ 
            current_redemptions: currentOffer.current_redemptions + 1
          })
          .eq('id', offerId);
      }

      // Refresh data
      await fetchUserReward();
      await fetchActivities();
      await fetchRewardOffers();

      return true;
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setError('Failed to redeem reward');
      return false;
    }
  };

  // Award QR scan points
  const awardQRPoints = async (storeId: string, storeName: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc('award_points', {
        target_user_id: user.id,
        points_amount: 10,
        activity_type: 'qr_scan',
        activity_description: `QR scan at ${storeName}`,
        reference_id: storeId,
        reference_type: 'store'
      });

      if (error) throw error;

      // Refresh data
      await fetchUserReward();
      await fetchActivities();

      return true;
    } catch (err) {
      console.error('Error awarding QR points:', err);
      setError('Failed to award QR points');
      return false;
    }
  };

  // Get leaderboard data
  const getLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          profiles(name)
        `)
        .order('total_earned_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  };

  // Copy referral code to clipboard
  const copyReferralCode = async () => {
    if (!userReward?.referral_code) return false;

    try {
      await navigator.clipboard.writeText(userReward.referral_code);
      return true;
    } catch (err) {
      console.error('Error copying referral code:', err);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchUserReward(),
          fetchActivities(),
          fetchRewardOffers(),
          fetchReferrals()
        ]);
        
        setLoading(false);
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    userReward,
    activities,
    rewardOffers,
    referrals,
    loading,
    error,
    redeemRewardOffer,
    awardQRPoints,
    getLeaderboard,
    copyReferralCode,
    refetch: () => {
      fetchUserReward();
      fetchActivities();
      fetchRewardOffers();
      fetchReferrals();
    }
  };
};