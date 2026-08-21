"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import PaperPreview from "@/components/PaperPreview";
import { useToast } from "@/context/ToastContext";

export default function DigitizePage() {
  const [institution, setInstitution] = useState(null);

  useEffect(() => {
    api.getInstitutionDefaults()
      .then((d) => setInstitution({
        name: d.default_inst_name,
        address: d.default_inst_address,
        contact: d.default_inst_contact,
        teacherName: d.default_teacher_name,
        logoBase64: d.default_logo_base64,
        logoMimetype: d.default_logo_mimetype,
        customInstructions: d.default_custom_instructions,
        readingTime: d.default_reading_time,
      }))
      .catch(() => {});
  }, []);

  const [files, setFiles] = useState([]);
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [examTime, setExamTime] = useState("2 Hours");
  const [marks, setMarks] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleDigitize = async (e) => {
    e.preventDefault();
    setError("");
    if (files.length === 0) {
      setError("Please upload at least one photo of the paper.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.digitize(files);
      setBlocks(data.blocks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBlock = (i, text) => {
    setBlocks((prev) => prev.map((b, idx) => (idx === i ? text : b)));
  };

  const handleSaveHistory = async () => {
    try {
      await api.savePaper({ subject: subject || "Digitized Paper", board: "Digitized", content: blocks.join("\n\n") });
      showToast("Saved to history!", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="eyebrow mb-1">Handwritten → Digital</div>
        <h1 className="mb-2 text-2xl">📷 Digitize a Handwritten Paper</h1>
        <p className="mb-6 text-sm text-slate-500">
          Upload photos of a handwritten or scanned question paper — we&apos;ll read it and turn it into a clean, editable digital paper.
        </p>

        <form onSubmit={handleDigitize} className="card space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Upload page photos (one or more, in order)</label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="file-input-btn"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Subject</label>
              <input className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Class</label>
              <input className="input-field" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Class 10" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Time</label>
              <input className="input-field" value={examTime} onChange={(e) => setExamTime(e.target.value)} placeholder="e.g. 2 Hours" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Marks</label>
              <input className="input-field" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="e.g. 50" />
            </div>
          </div>

          {error && <p className="msg-error">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Reading your paper..." : "📷 Digitize Paper"}
          </button>
        </form>

        {blocks.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 no-print">
              <h2 className="text-xl">Your Digitized Paper</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50">
                  🖨️ Print / Save as PDF
                </button>
                <button onClick={handleSaveHistory} className="btn-primary px-4 py-2 text-sm">
                  ☁️ Save to History
                </button>
              </div>
            </div>

            <details className="card no-print">
              <summary className="cursor-pointer text-sm font-medium text-[#17263D]">🛠️ Review &amp; Edit questions</summary>
              <div className="mt-3 space-y-3">
                {blocks.map((b, i) => (
                  <textarea
                    key={i}
                    className="input-field"
                    rows={3}
                    value={b}
                    onChange={(e) => updateBlock(i, e.target.value)}
                  />
                ))}
              </div>
            </details>

            <PaperPreview
              blocks={blocks}
              subject={subject || "Digitized Paper"}
              className={className}
              marks={marks}
              examTime={examTime}
              institution={institution}
              customInstructions={institution?.customInstructions || ""}
              readingTime={institution?.readingTime || ""}
            />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
