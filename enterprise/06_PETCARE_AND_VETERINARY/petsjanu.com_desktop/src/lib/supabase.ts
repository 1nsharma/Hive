import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Supabase credentials safely from environment variables
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  try {
    const meta = (globalThis as any).importMeta || (typeof import.meta !== 'undefined' ? import.meta : null);
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch {
    // Fallback if import.meta is unavailable
  }
  return fallback;
};

export const isSupabaseConfigured = (): boolean => {
  const url = getEnvVar('VITE_SUPABASE_URL', getEnvVar('NEXT_PUBLIC_SUPABASE_URL', ''));
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY', getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''));
  return Boolean(
    url &&
    key &&
    !url.includes('placeholder') &&
    !url.includes('xyzcompany') &&
    key.trim() !== '' &&
    !key.includes('placeholder')
  );
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', getEnvVar('NEXT_PUBLIC_SUPABASE_URL', ''));
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''));

const isConfigured = isSupabaseConfigured();

if (!isConfigured) {
  console.warn('[Supabase] Missing required credentials. Operating with local fallback.');
}

// Safely initialize Supabase client only when valid credentials exist.
// Provide safe no-op mock when credentials are absent to prevent fatal "supabaseKey is required" crash.
export const supabase: SupabaseClient | any = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        eq: function () { return this; }
      })
    };

