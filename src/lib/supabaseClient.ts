// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // ✅ session localStorage me save hoga
    autoRefreshToken: true,     // ✅ token expire hone pe auto refresh hoga
    detectSessionInUrl: true,   // ✅ multi-tab aur redirect ke liye zaroori
  },
});