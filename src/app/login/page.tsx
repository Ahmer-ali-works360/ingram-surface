"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect"); // 👈 key part

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * 🔍 CHECK IF USER IS ALREADY LOGGED IN (ONCE)
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        // If already logged in, respect redirect or go home
        router.push(redirectTo || "/");
      }
    });
  }, [router, redirectTo]);

  /**
   * 🔐 HANDLE LOGIN
   */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      // ✅ Redirect logic
      router.push(redirectTo || "/");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 pb-32 overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{
          backgroundImage: "url('/computer-mouse-object-background.jpg')",
        }}
      />

      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-white opacity-95 z-0" />

      {/* CONTENT */}
      <div className="relative z-10 w-[480px] bg-white border-[10px] border-[#F9F9F9] p-12 rounded-[6px] animate-slide-up">
        <h1 className="text-[22px] font-[600] mb-6 text-[#222] text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[14px] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#d1d1d1] px-3 py-[10px] text-[14px] rounded-[4px]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[14px] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#d1d1d1] px-3 py-[10px] text-[14px] rounded-[4px]"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 text-[14px] text-[#AAAAAA]">
            <input type="checkbox" />
            <span>Keep me signed in</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#3ba1da] text-white py-[11px] text-[14px] font-[500] rounded-[4px] hover:bg-[#44b0ec]"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <a
              href="/account-registration"
              className="flex-1 text-center bg-[#e5e5e5] text-[#333] py-[11px] text-[14px] font-[500] rounded-[4px] hover:bg-[#dcdcdc]"
            >
              REGISTER
            </a>
          </div>
        </form>

        {/* Forgot password */}
        <div className="text-center mt-5 text-[14px] text-[#AAAAAA]">
          <a href="/forgot-password" className="hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
