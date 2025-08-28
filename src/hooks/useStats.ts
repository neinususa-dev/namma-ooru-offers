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

      // Since RLS prevents counting all profiles, let's use a different approach
      // We'll get the actual profile records first to count them
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('role');

      console.log('Profiles query result:', { profilesCount: allProfiles?.length, profilesError });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // If we can't access profiles due to RLS, set default values
        const newStats = {
          totalStores: storesCount || 0,
          totalCustomers: 0,
          totalMerchants: 0
        };
        console.log('Using fallback stats due to RLS:', newStats);
        setStats(newStats);
        return;
      }

      // Count by role manually
      const customersCount = allProfiles?.filter(p => p.role === 'customer').length || 0;
      const merchantsCount = allProfiles?.filter(p => p.role === 'merchant').length || 0;

      const newStats = {
        totalStores: storesCount || 0,
        totalCustomers: customersCount,
        totalMerchants: merchantsCount
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