import { Database } from '@/src/types/supabase';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

// Local Supabase uses a standard anon key for development
// For production, use environment variables:
// EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY

// For mobile devices/emulators, use the machine's IP address instead of localhost
// Android emulator uses 10.0.2.2 to access host machine's localhost
// Physical Android devices need your computer's IP address (e.g., 192.168.x.x)
// iOS simulator can use localhost, but physical devices need the actual IP
const getLocalUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  
  // If it's a production URL (https), use it as-is
  if (envUrl && envUrl.startsWith('https://')) {
    return envUrl;
  }
  
  // For local development URLs, handle different scenarios:
  if (envUrl && envUrl.includes('127.0.0.1')) {
    // If using Expo Go on physical Android device, replace with your computer's IP
    // Set EXPO_PUBLIC_LOCAL_IP in .env file with your computer's IP (run: ipconfig on Windows)
    // For Android emulator, use 10.0.2.2
    // For physical device, use your computer's IP from .env
    if (Platform.OS === 'android') {
      const localIP = process.env.EXPO_PUBLIC_LOCAL_IP || '10.0.2.2'; // Default to emulator IP
      return envUrl.replace('127.0.0.1', localIP);
    }
  }
  
  // Default fallbacks
  if (Platform.OS === 'android') {
    const localIP = process.env.EXPO_PUBLIC_LOCAL_IP || '10.0.2.2'; // Default to emulator IP
    return envUrl || `http://${localIP}:54321`;
  }
  
  return envUrl || 'http://127.0.0.1:54321';
};

const supabaseUrl = getLocalUrl();
// Standard local Supabase anon key (same for all local projects)
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: undefined, // We will set up SecureStore for auth later
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});