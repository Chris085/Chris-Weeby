import { createClient } from '@supabase/supabase-js';

// DEV ONLY fallback (remove before production)
import { SUPABASE_TEMP_CONFIG } from './supabaseConfig.temp';

// Prefer Vite's import.meta.env when available, otherwise read process.env (for Node/SSR)
const env =
  typeof (import.meta as any) !== 'undefined'
    ? (import.meta as any).env
    : typeof process !== 'undefined'
    ? (process.env as any)
    : undefined;

const SUPABASE_URL =
  env?.VITE_SUPABASE_URL || SUPABASE_TEMP_CONFIG?.url;

const SUPABASE_ANON_KEY =
  env?.VITE_SUPABASE_ANON_KEY || SUPABASE_TEMP_CONFIG?.anonKey;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'or provide lib/supabaseConfig.temp.ts for development.'
  );
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);