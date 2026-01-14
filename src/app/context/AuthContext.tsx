"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any | null;
  role: string | null;
  status: string | null;
  loading: boolean;
  setUser: (user: any | null) => void;
  setRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userData: any) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", userData.id)
        .single();

      if (profileData) {
        setRole(profileData.role);
        setStatus(profileData.status);
      } else {
        setRole(null);
        setStatus(null);
      }
    } catch {
      setRole(null);
      setStatus(null);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (session.expires_at && session.expires_at * 1000 < Date.now()) {
          setUser(null);
          setRole(null);
          setStatus(null);
        } else {
          setUser(session.user);
          await fetchProfile(session.user);
        }
      } else {
        setUser(null);
        setRole(null);
        setStatus(null);
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
        setStatus(null);

        // ✅ Explicitly clear Supabase tokens
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          console.warn("Token cleanup warning:", e);
        }
      }

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setRole(null);
        setStatus(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, status, loading, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
