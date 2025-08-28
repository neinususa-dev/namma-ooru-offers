import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Stats {
  totalStores: number;
  totalCustomers: number;
  totalMerchants: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    totalStores: 0,
    totalCustomers: 0,
    totalMerchants: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching stats...');

      // Fetch stores count (should work with existing RLS)
      const { count: storesCount, error: storesError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      console.log('Stores query result:', { storesCount, storesError });

      if (storesError) {
        console.error('Error fetching stores count:', storesError);
        throw storesError;
      }

      // Use the security definer function to get profile stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_profile_stats');

      console.log('Profile stats query result:', { statsData, statsError });

      if (statsError) {
        console.error('Error fetching profile stats:', statsError);
        throw statsError;
      }

      const profileStats = statsData?.[0] || { customer_count: 0, merchant_count: 0 };

      const newStats = {
        totalStores: storesCount || 0,
        totalCustomers: Number(profileStats.customer_count) || 0,
        totalMerchants: Number(profileStats.merchant_count) || 0
      };

      console.log('Stats fetched successfully:', newStats);
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      // Set fallback values on error
      setStats({
        totalStores: 0,
        totalCustomers: 0,
        totalMerchants: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
}