import { createClient } from '@supabase/supabase-js';

/**
 * SUPABASE CONFIGURATION
 * 
 * To connect your database:
 * 1. Replace the strings below with your actual project credentials 
 *    OR 
 * 2. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL; 
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials missing. Please provide your URL and Anon Key in lib/supabaseClient.ts ' +
    'to enable the database features (Admin Dashboard, Contact Form, etc.).'
  );
}

export const supabase = createClient(
  SUPABASE_URL || 'https://your-project-id.supabase.co', 
  SUPABASE_ANON_KEY || 'your-anon-key'
);
