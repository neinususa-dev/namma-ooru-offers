import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'merchant' | 'super_admin';
  is_premium: boolean;
  is_active: boolean;
  phone_number?: string;
  store_name?: string;
  store_location?: string;
  district?: string;
  city?: string;
  current_plan?: string;
  plan_amount?: number;
  plan_selected_at?: string;
  payment_method?: string;
  plan_status?: string;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch profile if we don't already have it
          if (!profile || profile.id !== session.user.id) {
            setTimeout(() => {
              if (mounted) {
                fetchUserProfile(session.user.id);
              }
            }, 0);
          } else {
            setLoading(false); // Profile already exists, stop loading
          }
        } else {
          setProfile(null);
          setLoading(false); // No user, stop loading
        }
      }
    );

    // Check for existing session only once
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove profile dependency to prevent infinite loops

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      console.log('Profile data received:', data);

      // Check if user account is disabled
      if (data && !data.is_active) {
        console.log('User account is disabled, signing out...');
        // Sign out the user immediately
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Only update if profile actually changed
      setProfile(prevProfile => {
        if (!data) {
          console.log('No profile data found');
          return null;
        }
        if (prevProfile?.id === data.id && prevProfile?.updated_at === data.updated_at) {
          console.log('Profile unchanged, skipping update');
          return prevProfile; // No change, don't trigger re-render
        }
        console.log('Setting new profile data');
        return data;
      });
      
      setLoading(false); // Set loading to false after profile is fetched
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'customer' | 'merchant',
    additionalData?: {
      phone_number?: string;
      store_name?: string;
      store_location?: string;
      district?: string;
      city?: string;
    }
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
            ...additionalData
          }
        }
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Pre-signin cleanup error (continuing):', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { data, error };
      }

      // Check if user profile exists and is active
      if (data.user) {
        console.log('Checking user profile status...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_active, name')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking profile:', profileError);
          return { data, error: profileError };
        }

        if (profileData && !profileData.is_active) {
          console.log('User account is disabled');
          // Sign out the user immediately
          await supabase.auth.signOut();
          
          return { 
            data: null, 
            error: new Error('ACCOUNT_DISABLED') 
          };
        }
        
        console.log('Sign in successful:', data.user?.id);
      }

      // Let the auth state listener handle the redirect
      return { data, error };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { data: null, error };
    }
  };

  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out (continue even if it fails)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out error (continuing):', err);
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Force page reload for clean state
      window.location.href = '/';
      
      return { error: null };
    } catch (error) {
      // Even if there's an error, still redirect to clean state
      window.location.href = '/';
      return { error };
    }
  };

  const isCustomer = profile?.role === 'customer';
  const isMerchant = profile?.role === 'merchant';
  const isSuperAdmin = profile?.role === 'super_admin';

  return {
    user,
    session,
    profile,
    loading,
    isCustomer,
    isMerchant,
    isSuperAdmin,
    signUp,
    signIn,
    signOut
  };
}