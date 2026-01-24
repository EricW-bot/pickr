import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string | undefined = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey: string | undefined = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or API key');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;