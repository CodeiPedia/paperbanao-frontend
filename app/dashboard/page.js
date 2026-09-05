"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuestionTypeGrid, { DEFAULT_QUESTION_CONFIG } from "@/components/QuestionTypeGrid";
import PaperPreview from "@/components/PaperPreview";
import EditableQuestionList from "@/components/EditableQuestionList";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { savePendingForm, loadPendingForm } from "@/lib/formPersist";

export default function DashboardPage() {
  const { isAuthed } = useAuth();
  const router = useRouter();
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

  const [method, setMethod] = useState("quick"); // "quick" | "pdf"
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [topics, setTopics] = useState("");
  const [language, setLanguage] = useState("English");
  const [examTime, setExamTime] = useState("2 Hours");
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [config, setConfig] = useState(DEFAULT_QUESTION_CONFIG);

  const [pdfFile, setPdfFile] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [extractedText, setExtractedText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  const [blocks, setBlocks] = useState([]);
  const [diagrams, setDiagrams] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If we just came back from signup/login after clicking "Generate"
  // while browsing without an account, restore what was filled in so the
  // person doesn't have to start over.
  useEffect(() => {
    const pending = loadPendingForm("dashboard");
    if (!pending) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring saved form state after a signup/login redirect, standard one-time pattern
    setMethod(pending.method ?? "quick");
    setSubject(pending.subject ?? "");
    setClassName(pending.className ?? "");
    setTopics(pending.topics ?? "");
    setLanguage(pending.language ?? "English");
    setExamTime(pending.examTime ?? "2 Hours");
    setIncludeAnswerKey(pending.includeAnswerKey ?? true);
    setConfig(pending.config ?? DEFAULT_QUESTION_CONFIG);
    setExtractedText(pending.extractedText ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount to check for restored state
  }, []);

  const handleExtractPdf = async () => {
    if (!pdfFile) {
      setExtractError("Please choose a PDF first.");
      return;
    }
    setExtractError("");
    setExtracting(true);
    try {
      const data = await api.extractPdf(pdfFile, startPage, endPage);
      setExtractedText(data.text);
    } catch (err) {
      setExtractError(err.message);
    } finally {
      setExtracting(false);
    }
  };

  const [usedTopics, setUsedTopics] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");

    if (method === "pdf" && !extractedText.trim()) {
      setError("Please extract text from your PDF before generating.");
      return;
    }

    if (!isAuthed) {
      savePendingForm("dashboard", {
        method, subject, className, topics, language, examTime,
        includeAnswerKey, config, extractedText,
      });
      router.push(`/signup?redirect=${encodeURIComponent("/dashboard")}`);
      return;
    }

    const finalTopics = topics;

    setLoading(true);
    try {
      const payload = {
        subject,
        class_name: className,
        topics: method === "pdf" ? topics : finalTopics,
        source_text: method === "pdf" ? extractedText : "",
        language,
        include_answer_key: includeAnswerKey,
        mcq: config.mcq,
        fib: config.fib,
        true_false: config.true_false,
        short_answer: config.short_answer,
        long_answer: config.long_answer,
      };
      const data = await api.generatePaper(payload);
      setBlocks(data.blocks);
      setDiagrams(data.diagrams || {});
      setUsedTopics(method === "pdf" ? topics : finalTopics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { showToast } = useToast();

  const handleSaveHistory = async () => {
    try {
      await api.savePaper({ subject, board: "Standard", content: blocks.join("\n\n") });
      showToast("Saved to history!", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };


  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="eyebrow mb-1">Create</div>
        <h1 className="mb-6 text-2xl">Generate a Question Paper</h1>

        <form onSubmit={handleGenerate} className="card space-y-5">
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="method" checked={method === "quick"} onChange={() => setMethod("quick")} />
              ⚡ Quick
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="method" checked={method === "pdf"} onChange={() => setMethod("pdf")} />
              📄 PDF Extract
            </label>
          </div>

          {method === "quick" && (
            <p className="text-sm text-slate-500">
              📚 Building from a BSEB/NCERT syllabus (Class → Subject → Chapter)? Use the{" "}
              <Link href="/bseb" className="text-amber-600 underline">dedicated BSEB Board builder</Link> instead — more room to pick chapters clearly.
            </p>
          )}

          {method === "pdf" && (
            <div className="space-y-3 rounded border border-slate-200 p-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Upload PDF Book/Notes</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => { setPdfFile(e.target.files?.[0] || null); setExtractedText(""); }}
                  className="file-input-btn"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Start Page</label>
                  <input type="number" min={1} className="input-field" value={startPage} onChange={(e) => setStartPage(Number(e.target.value))} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">End Page</label>
                  <input type="number" min={1} className="input-field" value={endPage} onChange={(e) => setEndPage(Number(e.target.value))} />
                </div>
              </div>
              <button type="button" onClick={handleExtractPdf} disabled={extracting} className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                {extracting ? "Extracting..." : "Extract Text"}
              </button>
              {extractError && <p className="msg-error">{extractError}</p>}
              {extractedText && (
                <p className="msg-success">
                  ✓ Extracted {extractedText.length} characters from pages {startPage} to {endPage}.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Subject {method === "pdf" ? "(PDF)" : ""}</label>
              <input className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Class {method === "pdf" ? "(PDF)" : ""}</label>
              <input className="input-field" value={className} onChange={(e) => setClassName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {method === "pdf" ? "Specific Topics (optional)" : "Topics"}
            </label>
            <textarea className="input-field" rows={2} value={topics} onChange={(e) => setTopics(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Language</label>
              <select className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option>English</option>
                <option>Hindi</option>
                <option>Bilingual</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Time</label>
              <input className="input-field" value={examTime} onChange={(e) => setExamTime(e.target.value)} placeholder="e.g. 2 Hours" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeAnswerKey} onChange={(e) => setIncludeAnswerKey(e.target.checked)} />
                Include Answer Key
              </label>
            </div>
          </div>

          <QuestionTypeGrid config={config} setConfig={setConfig} />

          {error && <p className="msg-error">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Generating..." : "🚀 Generate Paper"}
          </button>
        </form>

        {blocks.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 no-print">
              <h2 className="text-xl">Generated Paper</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50">
                  🖨️ Print / Save as PDF
                </button>
                <button onClick={handleSaveHistory} className="btn-primary px-4 py-2 text-sm">
                  ☁️ Save to History
                </button>
              </div>
            </div>
            <div className="no-print">
              <EditableQuestionList blocks={blocks} setBlocks={setBlocks} subject={subject} topics={usedTopics} diagrams={diagrams} setDiagrams={setDiagrams} />
            </div>
            <PaperPreview
              blocks={blocks}
              subject={subject}
              className={className}
              marks={String(["mcq", "fib", "true_false", "short_answer", "long_answer"].reduce((sum, key) => sum + (config[key]?.count || 0) * (config[key]?.marks || 0), 0))}
              examTime={examTime}
              topics={usedTopics}
              institution={institution}
              customInstructions={institution?.customInstructions || ""}
              readingTime={institution?.readingTime || ""}
              diagrams={diagrams}
            />
          </div>
        )}
      </main>
    </>
  );
}
