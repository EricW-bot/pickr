import { Database } from '@/src/types/supabase';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Local Supabase uses a standard anon key for development
// For production, use environment variables:
// EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
// Standard local Supabase anon key (same for all local projects)
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: undefined, // We will set up SecureStore for auth later
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});