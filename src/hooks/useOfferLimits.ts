import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface PlanLimits {
  Silver: { maxOffers: 2; price: '₹0' };
  Gold: { maxOffers: 10; price: '₹500' };
  Platinum: { maxOffers: 30; price: '₹1500' };
}

export const PLAN_LIMITS: PlanLimits = {
  Silver: { maxOffers: 2, price: '₹0' },
  Gold: { maxOffers: 10, price: '₹500' },
  Platinum: { maxOffers: 30, price: '₹1500' }
};

export type PlanName = keyof PlanLimits;

export function useOfferLimits() {
  const { user, profile } = useAuth();
  const [monthlyOfferCount, setMonthlyOfferCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Determine current plan from profile
  const getCurrentPlan = (): PlanName => {
    if (!profile?.current_plan) return 'Silver';
    return (profile.current_plan as PlanName) || 'Silver';
  };

  const currentPlan = getCurrentPlan();
  const planLimits = PLAN_LIMITS[currentPlan];
  const canPostMoreOffers = monthlyOfferCount < planLimits.maxOffers;
  const remainingOffers = Math.max(0, planLimits.maxOffers - monthlyOfferCount);

  // Fetch current month's offer count
  const fetchMonthlyOfferCount = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get first and last day of current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const { data, error } = await supabase
        .from('offers')
        .select('id')
        .eq('merchant_id', user.id)
        .gte('created_at', firstDay.toISOString())
        .lte('created_at', lastDay.toISOString());

      if (error) throw error;

      setMonthlyOfferCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching monthly offer count:', error);
      setMonthlyOfferCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyOfferCount();
  }, [user]);

  const refreshCount = () => {
    fetchMonthlyOfferCount();
  };

  return {
    currentPlan,
    monthlyOfferCount,
    maxOffers: planLimits.maxOffers,
    remainingOffers,
    canPostMoreOffers,
    loading,
    refreshCount,
    planLimits: PLAN_LIMITS
  };
}