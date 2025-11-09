import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    // If auth signup is successful, create corresponding record in public.users table
    if (data.user && !error) {
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          full_name: userData.full_name || userData.name || '',
          email: data.user.email,
          role: userData.role || 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (userInsertError) {
        console.error('Error creating user record:', userInsertError);
        // Return the user insert error instead of the auth error
        return { data, error: userInsertError };
      }
    }
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If sign in is successful but user record doesn't exist in custom users table, create it
    if (data.user && !error) {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking user existence:', fetchError);
      }
      
      // If user doesn't exist in custom users table, create it
      if (!existingUser) {
        const { error: userInsertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || data.user.email || '',
            role: data.user.user_metadata?.role || 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (userInsertError) {
          console.error('Error creating user record:', userInsertError);
        }
      }
    }
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    // Always clear local state, even if server-side logout fails
    if (error) {
      console.warn('Server-side logout failed, clearing local state:', error);
      setUser(null);
      setSession(null);
    }
    
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };
  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}