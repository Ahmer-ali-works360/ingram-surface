"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User, Lock, ChevronRight, Eye, EyeOff } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sidebar tab
  const [activeTab, setActiveTab] = useState<"account" | "password">("account");

  // Password form states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ---------------------------
  // Load session + profile
  // ---------------------------
  useEffect(() => {
    const loadProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile load error:", error);
        return;
      }

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setAvatarUrl(data.avatar_url || null);
      }
    };

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      await loadProfile(session.user.id);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/login");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // ---------------------------
  // Avatar upload
  // ---------------------------
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Force image refresh
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
    } catch (err) {
      console.error(err);
      alert("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------
  // Update profile
  // ---------------------------
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Update error:", error);
      alert("Update failed: " + error.message);
      return;
    }

    alert("Profile updated successfully!");
  };

  // ---------------------------
  // Change password with old password verification
  // ---------------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      // Re-authenticate with old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        alert("Old password is incorrect!");
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        alert("Password change failed: " + updateError.message);
        return;
      }

      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong while changing password.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-8">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 bg-gray-200 p-4 rounded-md">
        <div className="flex flex-col items-center gap-4 mb-6">
          {avatarUrl ? (
  <div className="w-40 h-40 relative rounded-full overflow-hidden">
    <Image
      src={avatarUrl}
      alt="Profile"
      fill
      className="object-cover"
    />
  </div>
) : (
  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
    <span className="text-white text-3xl">
      {user.email?.charAt(0).toUpperCase()}
    </span>
  </div>
)}


          <p className="font-semibold text-sm">{user.email}</p>

          <label className="text-sm text-blue-500 cursor-pointer">
            {uploading ? "Uploading..." : "Change Photo"}
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2 text-sm w-full">
        

          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center justify-between px-3 py-2 rounded w-full transition ${activeTab === "account" ? "bg-blue-200" : "hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-700">Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center justify-between px-3 py-2 rounded w-full transition ${activeTab === "password" ? "bg-blue-200" : "hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-700">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </nav>
      </div>

      {/* RIGHT FORM */}
      <div className="w-3/4 bg-white p-6 rounded-md shadow-md flex flex-col gap-4">
        {activeTab === "account" ? (
          <form onSubmit={handleUpdateAccount} className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold mb-4">Account</h1>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Update Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold mb-4">Change Password</h1>

              {/* Old Password */}
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showOld ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showNew ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Change Password
              </button>
            </div>



          </form>
        )}
      </div>
    </div>
  );
}
