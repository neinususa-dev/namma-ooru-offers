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

      // Fetch stores count
      const { count: storesCount, error: storesError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (storesError) {
        console.error('Error fetching stores count:', storesError);
        throw storesError;
      }

      // Fetch customers count from profiles table
      const { count: customersCount, error: customersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      if (customersError) {
        console.error('Error fetching customers count:', customersError);
        throw customersError;
      }

      // Fetch merchants count from profiles table
      const { count: merchantsCount, error: merchantsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'merchant');

      if (merchantsError) {
        console.error('Error fetching merchants count:', merchantsError);
        throw merchantsError;
      }

      const newStats = {
        totalStores: storesCount || 0,
        totalCustomers: customersCount || 0,
        totalMerchants: merchantsCount || 0
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