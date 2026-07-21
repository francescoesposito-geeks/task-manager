import { createClient } from "@supabase/supabase-js";

// Aggiungi 'process.env.' davanti ai nomi delle variabili per accedervi dal env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// bisogna passargli supabase URL e supabase anonymous key al client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
