"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { SkeletonForm } from "@/components/Skeleton";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

export default function AccountPage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    api.getMe().then(setMe).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match.");
      return;
    }
    setChanging(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      showToast("Password updated successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setChanging(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <div className="eyebrow mb-1">Your account</div>
        <h1 className="mb-6 text-2xl">Account</h1>

        {loading ? (
          <SkeletonForm rows={3} />
        ) : (
          <>
            <div className="card mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Username</span>
                <span className="font-medium">{me?.username}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Email</span>
                <span className="font-medium">{me?.email || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Plan</span>
                {me?.is_pro ? (
                  <span className="badge badge-pro">🌟 Pro</span>
                ) : (
                  <span className="text-slate-700">Free ({me?.papers_generated ?? 0}/5 papers used)</span>
                )}
              </div>
              {me?.is_pro && me?.pro_expires_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pro active until</span>
                  <span className="font-medium">
                    {new Date(me.pro_expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="mb-4 text-lg">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Current Password</label>
                  <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">New Password</label>
                  <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
                  <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
                </div>

                {pwError && <p className="msg-error">{pwError}</p>}

                <button type="submit" disabled={changing} className="btn-primary w-full">
                  {changing ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
