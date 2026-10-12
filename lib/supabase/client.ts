import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// the publishable key (sb_publishable_...) replaces the legacy anon key,
// which Supabase is retiring: the old variable name still works
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

// The client is created only when Supabase mode is used,
// so the app builds and runs without Supabase keys in local mode.
export function getSupabase(): SupabaseClient {
  if (client) {
    return client;
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase mode needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (see .env.example)."
    );
  }

  client = createClient(supabaseUrl, supabaseKey);
  return client;
}
