import { supabase } from '@/src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  id: string;
  username: string | null;
  gold: number | null;
  dust: number | null;
  tokens: number | null;
  wins: number | null;
  losses: number | null;
  draws: number | null;
  trophies: number | null;
  games_played: number | null;
  avatar_url: string | null;
  created_at: string | null;
}

interface AuthContextType {
  session: Session | null | undefined;
  user: UserData | null;
  signInUser: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  signUpNewUser: (email: string, password: string, username: string) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  //Session state (user info, sign-in status)
  const [session, setSession] = useState<any>(undefined);
  const [user, setUser] = useState<UserData | null>(null);

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
    if (!session) {
      setUser(null);
      return;
    }

    async function fetchUser() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, gold, dust, trophies, tokens, wins, losses, draws, avatar_url, created_at')
          .eq('id', session.user.id)
          .single();
        if (error) {
          throw error;
        }
        if (data) {
          console.log('Fetched user:', data);
          const dbData = data as unknown as {
            id: string;
            username: string | null;
            gold: number | null;
            dust: number | null;
            trophies: number | null;
            tokens: number | null;
            wins: number | null;
            losses: number | null;
            draws: number | null;
            games_played: number | null;
            avatar_url: string | null;
            created_at: string | null;
          };
          const userData: UserData = {
            id: dbData.id,
            username: dbData.username ?? null,
            gold: dbData.gold ?? null,
            dust: dbData.dust ?? null,
            tokens: dbData.tokens ?? null,
            wins: dbData.wins ?? null,
            losses: dbData.losses ?? null,
            draws: dbData.draws ?? null,
            games_played: (dbData.wins ?? 0) + (dbData.losses ?? 0) + (dbData.draws ?? 0),
            trophies: dbData.trophies ?? null,
            avatar_url: dbData.avatar_url ?? null,
            created_at: dbData.created_at ?? null,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
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
      try {
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        if (userErr) {
          console.warn('Could not read current user before sign-out:', userErr.message);
        }

        const userId = userRes?.user?.id ?? session?.user?.id;
        if (userId) {
          const { error: lastOnlineErr } = await (supabase as any)
            .from('users')
            .update({ last_online: new Date().toISOString() } as any)
            .eq('id', userId);

          if (lastOnlineErr) {
            console.warn('Could not update last_online before sign-out:', lastOnlineErr.message);
          }
        }
      } catch (e) {
        console.warn('Unexpected error updating last_online before sign-out:', e);
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign-out error:', error.message);
        return { success: false, error: error.message };
      }
      setUser(null);
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
    <AuthContext.Provider value={{ session, user, signInUser, signOut, signUpNewUser }}>
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