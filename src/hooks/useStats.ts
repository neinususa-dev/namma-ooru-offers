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

      // Fetch stores count
      const { count: storesCount, error: storesError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (storesError) {
        throw storesError;
      }

      // Fetch customers count
      const { count: customersCount, error: customersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      if (customersError) {
        throw customersError;
      }

      // Fetch merchants count
      const { count: merchantsCount, error: merchantsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'merchant');

      if (merchantsError) {
        throw merchantsError;
      }

      setStats({
        totalStores: storesCount || 0,
        totalCustomers: customersCount || 0,
        totalMerchants: merchantsCount || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
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