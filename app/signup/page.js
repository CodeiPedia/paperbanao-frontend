"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1 = signup form, 2 = OTP entry
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.signup(username, email, password);
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.verifySignupOtp(email, otp);
      login(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      const data = await api.resendSignupOtp(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card w-full max-w-sm">
        {step === 1 ? (
          <>
            <div className="eyebrow mb-2">Get started</div>
            <h1 className="mb-1 text-2xl">Create your account</h1>
            <p className="mb-6 text-sm text-slate-500">5 free question papers, no card needed.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Username</label>
                <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>

              {error && <p className="msg-error">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Sending code..." : "Create Account"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="eyebrow mb-2">Verify your email</div>
            <h1 className="mb-1 text-2xl">Enter the code</h1>
            <p className="mb-6 text-sm text-slate-500">{message || `We sent a 6-digit code to ${email}.`}</p>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                className="input-field text-center text-lg tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                maxLength={6}
                inputMode="numeric"
              />

              {error && <p className="msg-error">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
            </form>

            <button
              onClick={handleResend}
              disabled={resending}
              className="mt-3 text-sm text-slate-500 hover:text-amber-600"
            >
              {resending ? "Sending..." : "Didn't get it? Resend code"}
            </button>
          </>
        )}

        <div className="mt-4 text-sm">
          <Link href="/login" className="text-slate-500 hover:text-amber-600">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
