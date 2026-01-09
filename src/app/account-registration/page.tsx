"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AccountRegistrationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [reseller, setReseller] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    /**
     * 1️⃣ CREATE AUTH USER (REGISTER ONLY)
     */
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("User creation failed");
      return;
    }

    /**
     * 2️⃣ INSERT PROFILE DATA
     * ✅ Email added here
     */
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: email.trim(),            // 👈 ADDED: save email
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        reseller: reseller.trim(),
        role: "subscriber",
        status: "pending",              // optional, admin approval flow
      });

    setLoading(false);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    await supabase.auth.signOut();

    // ✅ SHOW MODAL (no browser alert)
    setShowSuccessModal(true);
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

      {/* CARD */}
      <div className="relative z-10 w-[480px] bg-white border-[10px] border-[#F9F9F9] p-12 rounded-[6px] animate-slide-up">
        <h1 className="text-[28px] font-semibold text-gray-900 mb-6 text-center">
          Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email (Username)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Reseller
            </label>
            <input
              type="text"
              required
              value={reseller}
              onChange={(e) => setReseller(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded-[4px]"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3ba1da] text-white py-[11px] px-8 text-[14px] font-[500] rounded-[4px] hover:bg-[#44b0ec]"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[420px] rounded-md p-6 shadow-lg text-center animate-fade-in">
            <h2 className="text-[18px] font-semibold text-gray-900 mb-3">
              Registration Successful
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              User registration successful. You can login when admin approves
              your registration.
            </p>

            <button
              onClick={() => router.push("/")}
              className="bg-[#3ba1da] text-white px-6 py-2 text-sm rounded hover:bg-[#44b0ec]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
