// src/app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any | null;
  role: string | null;
  status: string | null;
  loading: boolean;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRole = async (userId: string) => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (!error && profileData) {
      setRole(profileData.role);
      setStatus(profileData.status);
      console.log("AuthContext - Fetched role:", profileData.role);
    } else {
      console.error("Error fetching profile:", error?.message);
      setRole(null);
      setStatus(null);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setStatus(null);
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setStatus(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, status, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
