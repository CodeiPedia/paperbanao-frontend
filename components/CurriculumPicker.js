"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CurriculumPicker({ onTopicsChange, onSelectionChange, onFullSyllabusChange }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [chaptersBySubject, setChaptersBySubject] = useState({});
  const [weightageBySubject, setWeightageBySubject] = useState({});
  const [selectedChapters, setSelectedChapters] = useState({});
  const [newChaptersText, setNewChaptersText] = useState({});
  const [saveStatus, setSaveStatus] = useState({});

  useEffect(() => {
    api.getClasses().then(setClasses).catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    api.getSubjects(selectedClass).then(setSubjects).catch(() => setSubjects([]));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting dependent selections when the class changes
    setSelectedSubjects([]);
    setChaptersBySubject({});
    setSelectedChapters({});
  }, [selectedClass]);

  useEffect(() => {
    selectedSubjects.forEach((subj) => {
      if (!(subj in chaptersBySubject)) {
        api.getChapters(selectedClass, subj).then((chs) => {
          setChaptersBySubject((prev) => ({ ...prev, [subj]: chs }));
        }).catch(() => {});
        // Exam-pattern weightage data — currently only researched for a
        // few subject/class combinations (see backend app/exam_weightage.py).
        // Returns an empty object for anything not yet researched, which
        // is fine — the UI just shows no badges in that case.
        api.getWeightage(selectedClass, subj).then((w) => {
          setWeightageBySubject((prev) => ({ ...prev, [subj]: w }));
        }).catch(() => {});
      }
    });
  }, [selectedSubjects, selectedClass]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const combined = [];
    selectedSubjects.forEach((subj) => {
      (selectedChapters[subj] || []).forEach((ch) => combined.push(`${subj}: ${ch}`));
    });
    onTopicsChange(combined.join("; "));
  }, [selectedChapters, selectedSubjects]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selectedClass, selectedSubjects);
  }, [selectedClass, selectedSubjects]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Full syllabus" means every selected subject has ALL of its available
  // chapters selected — used to show a clean "FULL TEST" heading on the
  // generated paper instead of an unwieldy list of every chapter name.
  useEffect(() => {
    const isFullSyllabus =
      selectedSubjects.length > 0 &&
      selectedSubjects.every((subj) => {
        const available = chaptersBySubject[subj] || [];
        const selected = selectedChapters[subj] || [];
        return available.length > 0 && selected.length === available.length;
      });
    if (onFullSyllabusChange) onFullSyllabusChange(isFullSyllabus);
  }, [selectedChapters, selectedSubjects, chaptersBySubject]); // eslint-disable-line react-hooks/exhaustive-deps

  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      setSelectedSubjects([...selectedSubjects, trimmed]);
      setNewSubject("");
    }
  };

  const toggleChapter = (subj, chapter) => {
    setSelectedChapters((prev) => {
      const current = prev[subj] || [];
      const next = current.includes(chapter) ? current.filter((c) => c !== chapter) : [...current, chapter];
      return { ...prev, [subj]: next };
    });
  };

  const selectAllChapters = (subj) => {
    setSelectedChapters((prev) => ({ ...prev, [subj]: [...(chaptersBySubject[subj] || [])] }));
  };

  const clearAllChapters = (subj) => {
    setSelectedChapters((prev) => ({ ...prev, [subj]: [] }));
  };

  const saveChapters = async (subj) => {
    const newOnes = (newChaptersText[subj] || "").split(",").map((c) => c.trim()).filter(Boolean);
    if (newOnes.length === 0) return;
    try {
      const result = await api.saveChapters(selectedClass, subj, newOnes);
      setChaptersBySubject((prev) => ({ ...prev, [subj]: result.chapters }));
      setNewChaptersText((prev) => ({ ...prev, [subj]: "" }));
      setSaveStatus((prev) => ({ ...prev, [subj]: "Saved!" }));
      setTimeout(() => setSaveStatus((prev) => ({ ...prev, [subj]: "" })), 2000);
    } catch (err) {
      setSaveStatus((prev) => ({ ...prev, [subj]: "Couldn't save. Try again." }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Class</label>
          <select className="input-field" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Subject(s)</label>
          <select
            className="input-field"
            multiple
            value={selectedSubjects}
            onChange={(e) => setSelectedSubjects(Array.from(e.target.selectedOptions, (o) => o.value))}
            disabled={!selectedClass}
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && (
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Add a new subject for this class"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <button type="button" onClick={addSubject} className="btn-primary whitespace-nowrap px-4">
            Add
          </button>
        </div>
      )}

      {selectedSubjects.map((subj) => (
        <div key={subj} className="card">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base">📖 {subj} — chapters</h3>
            {(chaptersBySubject[subj] || []).length > 0 && (
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => selectAllChapters(subj)} className="text-amber-700 hover:underline">
                  Select all
                </button>
                <span className="text-slate-300">|</span>
                <button type="button" onClick={() => clearAllChapters(subj)} className="text-slate-500 hover:underline">
                  Clear
                </button>
              </div>
            )}
          </div>
          {Object.values(weightageBySubject[subj] || {}).some((w) => w.priority === "high") && (
            <p className="mb-2 text-xs text-slate-400">
              ⭐ = high-weightage chapter in the BSEB exam pattern (hover a chapter for details).
            </p>
          )}
          {(chaptersBySubject[subj] || []).length > 0 &&
            (selectedChapters[subj] || []).length === (chaptersBySubject[subj] || []).length && (
              <p className="mb-2 text-xs text-slate-400">
                📝 All chapters selected — this will generate a full-syllabus practice paper covering every
                chapter, spread as evenly as possible. (Not a guaranteed exact replica of any official board
                paper&apos;s mark distribution.)
              </p>
          )}
          <div className="mb-3 flex flex-wrap gap-2">
            {(chaptersBySubject[subj] || []).map((ch) => {
              const active = (selectedChapters[subj] || []).includes(ch);
              const weightage = (weightageBySubject[subj] || {})[ch];
              return (
                <button
                  type="button"
                  key={ch}
                  onClick={() => toggleChapter(subj, ch)}
                  title={weightage ? `${weightage.unit} — ~${weightage.unit_marks} marks in the BSEB exam` : undefined}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    active ? "border-amber-500 bg-amber-100 text-amber-800" : "border-slate-300 text-slate-600"
                  }`}
                >
                  {ch}
                  {weightage?.priority === "high" && <span className="ml-1" aria-label="High weightage chapter">⭐</span>}
                </button>
              );
            })}
            {(chaptersBySubject[subj] || []).length === 0 && (
              <span className="text-xs text-slate-400">No chapters saved yet — add some below.</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              className="input-field"
              placeholder="Add new chapters, comma-separated"
              value={newChaptersText[subj] || ""}
              onChange={(e) => setNewChaptersText((prev) => ({ ...prev, [subj]: e.target.value }))}
            />
            <button type="button" onClick={() => saveChapters(subj)} className="btn-primary whitespace-nowrap px-4">
              Save
            </button>
          </div>
          {saveStatus[subj] && <p className="mt-1 text-xs text-slate-500">{saveStatus[subj]}</p>}
        </div>
      ))}
    </div>
  );
}
