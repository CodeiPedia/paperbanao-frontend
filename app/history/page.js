"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { SkeletonList } from "@/components/Skeleton";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

export default function HistoryPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setPapers(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load() is intentionally called only once on mount
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deletePaper(id);
      setPapers((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
      showToast("Paper deleted.", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="eyebrow mb-1">Saved papers</div>
        <h1 className="mb-1 text-2xl">Cloud History</h1>
        <p className="mb-6 text-xs text-slate-400">Question papers are automatically deleted after 30 days.</p>

        {loading && <SkeletonList count={3} />}

        {!loading && papers.length === 0 && (
          <div className="empty-state card">
            <div className="icon">🗂️</div>
            <p className="mb-4">No saved papers yet. Generate one and save it to see it here.</p>
            <Link href="/dashboard" className="btn-primary inline-block">Generate a Paper</Link>
          </div>
        )}

        <div className="space-y-3">
          {papers.map((p) => (
            <div key={p.id} className="card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold">{p.subject}</h3>
                  <p className="text-xs text-slate-500">{p.date} · {p.board}</p>
                </div>
                {confirmId === p.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(p.id)} className="rounded bg-red-600 px-3 py-1 text-xs text-white">
                      Confirm Delete
                    </button>
                    <button onClick={() => setConfirmId(null)} className="rounded border px-3 py-1 text-xs">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmId(p.id)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600">
                    🗑️ Delete
                  </button>
                )}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-amber-700">View content</summary>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{p.content}</p>
              </details>
            </div>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  );
}
