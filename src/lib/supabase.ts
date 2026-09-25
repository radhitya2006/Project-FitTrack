// ============================================================
// FitTrack — Supabase Client
// ============================================================
//
// Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from
// environment variables (set via .env or hosting platform).
//
// Usage:
//   import { supabase } from '@/lib/supabase';
//
// This module is intentionally kept minimal — no auth helpers,
// no custom hooks, no data-fetching wrappers yet.
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[FitTrack] Missing Supabase environment variables. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. ' +
    'The app will continue using Dexie (local) storage until Supabase is configured.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
);
