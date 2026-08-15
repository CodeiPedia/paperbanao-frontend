"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.requestPasswordReset(identifier);
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.resetPassword(identifier, otp, newPassword);
      setMessage(data.message);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card w-full max-w-sm">
        <div className="eyebrow mb-2">Account recovery</div>
        <h1 className="mb-1 text-2xl">Reset password</h1>

        {step === 1 && (
          <form onSubmit={requestCode} className="mt-4 space-y-4">
            <p className="text-sm text-slate-500">Enter your username or email — we&apos;ll send a 6-digit code.</p>
            <input className="input-field" placeholder="Username or email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            {error && <p className="msg-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="mt-4 space-y-4">
            <p className="text-sm text-slate-500">{message}</p>
            <input className="input-field" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
            <input type="password" className="input-field" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            {error && <p className="msg-error">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && <p className="msg-success mt-4">{message}</p>}

        <div className="mt-4 text-sm">
          <Link href="/login" className="text-slate-500 hover:text-amber-600">Back to login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
