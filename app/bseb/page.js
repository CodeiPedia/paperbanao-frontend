"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import CurriculumPicker from "@/components/CurriculumPicker";
import QuestionTypeGrid, { DEFAULT_QUESTION_CONFIG } from "@/components/QuestionTypeGrid";
import PaperPreview from "@/components/PaperPreview";
import EditableQuestionList from "@/components/EditableQuestionList";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function BsebBoardPage() {
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

  const [curriculumTopics, setCurriculumTopics] = useState("");
  const [specificTopics, setSpecificTopics] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [language, setLanguage] = useState("English");
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [config, setConfig] = useState(DEFAULT_QUESTION_CONFIG);

  const [blocks, setBlocks] = useState([]);
  const [usedTopics, setUsedTopics] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSelectionChange = (selClass, selSubjects) => {
    setClassName(selClass);
    setSubject(selSubjects.join(", "));
  };

  const totalMarks = ["mcq", "fib", "true_false", "short_answer", "long_answer"]
    .reduce((sum, key) => sum + (config[key]?.count || 0) * (config[key]?.marks || 0), 0);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!curriculumTopics && !specificTopics.trim()) {
      showToast("Please select at least one chapter, or add specific topics.", "error");
      return;
    }
    const finalTopics = [curriculumTopics, specificTopics].filter(Boolean).join(", ");
    setLoading(true);
    try {
      const payload = {
        subject: subject || "BSEB Paper",
        class_name: className,
        topics: finalTopics,
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
      setUsedTopics(finalTopics);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHistory = async () => {
    try {
      await api.savePaper({ subject: subject || "BSEB Paper", board: "BSEB", content: blocks.join("\n\n") });
      showToast("Saved to history!", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="eyebrow mb-1">Syllabus-based</div>
        <h1 className="mb-2 text-2xl">🎓 Bihar Board (BSEB/NCERT) Paper Builder</h1>
        <p className="mb-6 text-sm text-slate-500">
          Pick class, subject(s), and chapters from your saved syllabus list — then set question types and marks.
          Tip: set Board Pattern to &quot;BSEB (Bihar Board)&quot; in Settings for BSEB-style formatting.
        </p>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="card">
            <h2 className="mb-3 text-base font-semibold text-[#17263D]">1. Class &amp; Subjects</h2>
            <CurriculumPicker onTopicsChange={setCurriculumTopics} onSelectionChange={handleSelectionChange} />
            {(className || subject) && (
              <p className="mt-3 text-xs text-slate-500">
                📄 Paper header will show: <strong>{subject || "—"}</strong>, <strong>{className || "—"}</strong>
              </p>
            )}
          </div>

          <div className="card">
            <h2 className="mb-3 text-base font-semibold text-[#17263D]">2. Specific Topics (optional)</h2>
            <p className="mb-2 text-xs text-slate-400">Narrow it down further within the chosen chapters, if needed.</p>
            <textarea className="input-field" rows={2} value={specificTopics} onChange={(e) => setSpecificTopics(e.target.value)} />
          </div>

          <div className="card">
            <h2 className="mb-3 text-base font-semibold text-[#17263D]">3. Language &amp; Answer Key</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Language</label>
                <select className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Bilingual</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={includeAnswerKey} onChange={(e) => setIncludeAnswerKey(e.target.checked)} />
                  Include Answer Key
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-3 text-base font-semibold text-[#17263D]">4. Counts &amp; Marks</h2>
            <QuestionTypeGrid config={config} setConfig={setConfig} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Generating..." : "🚀 Generate BSEB Paper"}
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
              <EditableQuestionList blocks={blocks} setBlocks={setBlocks} subject={subject} topics={usedTopics} />
            </div>
            <PaperPreview
              blocks={blocks}
              subject={subject}
              className={className}
              marks={String(totalMarks)}
              examTime="2 Hours"
              topics={usedTopics}
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
