"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { SkeletonForm } from "@/components/Skeleton";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

function UpgradeContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const paymentId = searchParams.get("razorpay_payment_id");
    if (!paymentId) return;

    const params = {
      razorpay_payment_id: paymentId,
      razorpay_payment_link_id: searchParams.get("razorpay_payment_link_id"),
      razorpay_payment_link_reference_id: searchParams.get("razorpay_payment_link_reference_id"),
      razorpay_payment_link_status: searchParams.get("razorpay_payment_link_status"),
      razorpay_signature: searchParams.get("razorpay_signature"),
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time payment callback check on mount
    setVerifying(true);
    api.verifyPaymentCallback(params)
      .then((data) => setResult(data))
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setVerifying(false));
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const data = await api.createPaymentLink();
      window.location.href = data.payment_url;
    } catch (err) {
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
      <div className="eyebrow mb-1">Go unlimited</div>
      <h1 className="mb-6 text-2xl">Upgrade to Pro</h1>

      {verifying && <SkeletonForm rows={1} />}

      {result && (
        <div className={`card mb-4 ${result.success ? "border-green-300" : "border-red-300"}`}>
          <p className={result.success ? "text-green-700" : "text-red-600"}>{result.message}</p>
        </div>
      )}

      <div className="card">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-500">Pro — 30 Days</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">50% OFF</span>
        </div>
        <div className="mb-1 flex items-baseline gap-2">
          <span className="font-serif text-3xl text-[#17263D]">₹99</span>
          <span className="text-lg text-slate-400 line-through">₹199</span>
          <span className="text-base text-slate-500">/ 30 days</span>
        </div>
        <p className="mb-4 text-xs italic text-slate-400">Cheaper than a pizza. 🍕</p>
        <ul className="mb-5 space-y-1 text-sm text-slate-600">
          <li>✓ Unlimited question papers</li>
          <li>✓ Unlimited digitization</li>
          <li>✓ Saved letterhead & branding</li>
        </ul>
        <button onClick={handleUpgrade} disabled={loading} className="btn-primary w-full">
          {loading ? "Redirecting to payment..." : "Pay ₹99 & Upgrade"}
        </button>
        <p className="mt-3 text-xs text-slate-400">
          One-time payment, doesn&apos;t auto-renew. You&apos;ll be redirected to Razorpay to complete payment securely.
        </p>
      </div>
    </main>
  );
}

export default function UpgradePage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <Suspense fallback={<div className="mx-auto w-full max-w-lg px-4 py-8"><SkeletonForm rows={2} /></div>}>
        <UpgradeContent />
      </Suspense>
    </ProtectedRoute>
  );
}
