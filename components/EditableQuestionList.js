"use client";
import { useState } from "react";
import { api } from "@/lib/api";

function extractQuestionNumber(text) {
  const m1 = text.match(/Q\.?\s*(\d+)/i);
  if (m1) return m1[1];
  const m2 = text.match(/^\s*\**\s*(\d+)\./);
  if (m2) return m2[1];
  return null;
}

export default function EditableQuestionList({ blocks, setBlocks, subject, topics, diagrams = {}, setDiagrams }) {
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);
  const [error, setError] = useState("");

  const answerKeyIndex = blocks.findIndex((b) => b.toUpperCase().includes("ANSWER KEY"));
  const isInAnswerKeySection = (i) => answerKeyIndex !== -1 && i >= answerKeyIndex;

  const updateBlock = (i, text) => {
    setBlocks((prev) => prev.map((b, idx) => (idx === i ? text : b)));
  };

  const handleRegenerate = async (i) => {
    setError("");
    setRegeneratingIndex(i);
    try {
      const oldText = blocks[i];
      const oldNumber = extractQuestionNumber(oldText);
      const data = await api.regenerateQuestion(oldText, subject, topics);

      const newBlocks = [...blocks];
      newBlocks[i] = data.question;

      // Keep the Answer Key in sync: find the matching answer entry (by
      // question number) and update it too, so the solution doesn't stay
      // pointing at the old question.
      if (data.answer && oldNumber) {
        const answerKeyIndex = newBlocks.findIndex((b) => b.toUpperCase().includes("ANSWER KEY"));
        if (answerKeyIndex !== -1) {
          for (let j = answerKeyIndex + 1; j < newBlocks.length; j++) {
            if (extractQuestionNumber(newBlocks[j]) === oldNumber) {
              newBlocks[j] = `**Q${oldNumber}.** ${data.answer}`;
              break;
            }
          }
        }
      }
      setBlocks(newBlocks);

      // If the regenerated question came with a new diagram, merge it in —
      // its marker id (e.g. "diagram_1") is scoped to this one response,
      // so it's safe to just add it alongside any existing diagrams.
      if (data.diagrams && Object.keys(data.diagrams).length > 0 && setDiagrams) {
        setDiagrams((prev) => ({ ...prev, ...data.diagrams }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  return (
    <details className="card">
      <summary className="cursor-pointer text-sm font-medium text-[#17263D]">🛠️ Edit Questions</summary>
      <p className="mt-2 mb-3 text-xs text-slate-400">
        Regenerating a question also updates its matching Answer Key entry, if one exists.
      </p>
      {error && <p className="msg-error mb-3">{error}</p>}
      <div className="space-y-3">
        {blocks.map((b, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="flex-1">
              <textarea
                className="input-field w-full"
                rows={3}
                value={b}
                onChange={(e) => updateBlock(i, e.target.value)}
              />
              {b.includes("{{DIAGRAM:") && (
                <p className="mt-1 text-xs text-slate-400">
                  📊 This question includes a diagram — keep the {"{{DIAGRAM:...}}"} marker if you want to keep it.
                </p>
              )}
            </div>
            {!isInAnswerKeySection(i) && (
              <button
                type="button"
                onClick={() => handleRegenerate(i)}
                disabled={regeneratingIndex !== null}
                className="whitespace-nowrap rounded border border-slate-300 px-2 py-1.5 text-xs hover:bg-slate-50 sm:self-start"
              >
                {regeneratingIndex === i ? "..." : "🔄 Regenerate"}
              </button>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
