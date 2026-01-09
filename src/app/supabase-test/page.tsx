"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseTestPage() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("SESSION:", data);
      console.log("ERROR:", error);
    });
  }, []);

  return <div>Open console to see Supabase connection</div>;
}
