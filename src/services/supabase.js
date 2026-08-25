import { createClient } from '@supabase/supabase-js';

// Supabase Environment Credentials (Defaults to local demo configuration)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xyz-demo.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function checkSupabaseHealth() {
  try {
    const { data, error } = await supabase.from('mines').select('count', { count: 'exact', head: true });
    if (error) {
      return { connected: false, message: error.message };
    }
    return { connected: true, count: data };
  } catch (err) {
    return { connected: false, message: err.message };
  }
}
