import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Store {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  district: string | null;
  city: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicStore {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  district: string | null;
  city: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useStores() {
  const [stores, setStores] = useState<PublicStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching stores from stores_public view...');
      
      // Use the public view that only exposes non-sensitive information
      const { data, error: fetchError } = await supabase
        .from('stores_public')
        .select('*')
        .order('name', { ascending: true });

      console.log('Stores fetch result:', { data, error: fetchError });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      console.log(`Successfully fetched ${data?.length || 0} stores`);
      setStores(data || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const refetch = () => {
    fetchStores();
  };

  return {
    stores,
    loading,
    error,
    refetch
  };
}