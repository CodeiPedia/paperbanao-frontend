"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import PaperPreview from "@/components/PaperPreview";
import { SkeletonList } from "@/components/Skeleton";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

export default function HistoryPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [printingPaper, setPrintingPaper] = useState(null);
  const [institution, setInstitution] = useState(null);
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
    api.getInstitutionDefaults()
      .then((d) => setInstitution({
        name: d.default_inst_name,
        address: d.default_inst_address,
        contact: d.default_inst_contact,
        teacherName: d.default_teacher_name,
        logoBase64: d.default_logo_base64,
        logoMimetype: d.default_logo_mimetype,
        logoPlacement: d.default_logo_placement || "left",
        headingFont: d.default_heading_font || "serif",
        headingSize: d.default_heading_size || "medium",
        customInstructions: d.default_custom_instructions,
        readingTime: d.default_reading_time,
      }))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load() is intentionally called only once on mount
  }, []);

  // Once a paper is selected to print, wait for it to render, then open
  // the browser's print dialog. Clearing the selection after printing (via
  // the "afterprint" event) keeps only one paper's print-area mounted at a
  // time — needed since the print CSS shows *any* .print-area on the page.
  useEffect(() => {
    if (!printingPaper) return;
    const timer = setTimeout(() => window.print(), 150);
    const handleAfterPrint = () => setPrintingPaper(null);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printingPaper]);

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
        <div className="no-print">
          <div className="eyebrow mb-1">Saved papers</div>
          <h1 className="mb-1 text-2xl">Cloud History</h1>
          <p className="mb-6 text-xs text-slate-400">
            Question papers are automatically deleted after 30 days. Printed copies only include Subject — Class, Marks, and Time aren&apos;t saved with history entries.
          </p>

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
                    <div className="flex gap-2">
                      <button onClick={() => setPrintingPaper(p)} className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50">
                        🖨️ Print
                      </button>
                      <button onClick={() => setConfirmId(p.id)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600">
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-amber-700">View content</summary>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{p.content}</p>
                </details>
              </div>
            ))}
          </div>
        </div>

        {printingPaper && (
          <PaperPreview
            blocks={printingPaper.content.split("\n\n")}
            subject={printingPaper.subject}
            className=""
            marks=""
            examTime=""
            institution={institution}
            customInstructions={institution?.customInstructions || ""}
            readingTime={institution?.readingTime || ""}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
