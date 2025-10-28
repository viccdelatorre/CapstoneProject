import { createClient } from '@supabase/supabase-js';

// These environment variables come from your .env file
// (never hardcode your keys directly in code!)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single shared Supabase client for the entire app
export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
