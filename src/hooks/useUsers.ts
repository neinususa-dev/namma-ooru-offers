import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'merchant' | 'super_admin';
  phone_number?: string;
  store_name?: string;
  store_location?: string;
  district?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useUsers(role?: 'customer' | 'merchant') {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (role) {
        query = query.eq('role', role);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      
      // Refresh the users list
      await fetchUsers();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update user' 
      };
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    return updateUser(userId, { is_active: isActive });
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    toggleUserStatus,
    refetch: fetchUsers
  };
}