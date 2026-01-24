import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null | undefined;
  signInUser: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  signUpNewUser: (email: string, password: string, username: string) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  //Session state (user info, sign-in status)
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(data.session);
      } catch (error: any) {
        console.error('Error getting session:', error?.message || error);
      }
    }
    getInitialSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log('Session changed:', session);
    })
  }, []);

  useEffect(() => {
    if (!session) return;

    async function fetchUser() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, gold, dust, tokens, wins, losses, draws, trophies, games_played')
          .eq('id', session.user.id)
          .single();
        if (error) {
          throw error;
        }
        console.log('Fetched user:', data);
        // Store user data if needed
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [session]);

  //Auth functions
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });
      if (error) {
        console.error('Supabase sign-in error:', error.message);
        return { success: false, error: error.message };
      }
      console.log('Supabase sign-in success:', data);
      return { success: true, data };
    } catch (error: any) {
      console.error('Unexpected error during sign-in:', error?.message || error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign-out error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during sign-out:', error);
      return { success: false, error: 'An unexpected error occurred during sign out.' };
    }
  }

  const signUpNewUser = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      });
      if (error) {
        console.error('Supabase sign-up error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error: any) {
      console.error('Unexpected error during sign-up:', error?.message || error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  return (
    <AuthContext.Provider value={{ session, signInUser, signOut, signUpNewUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};