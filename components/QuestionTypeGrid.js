"use client";

const TYPES = [
  { key: "mcq", label: "MCQs" },
  { key: "fib", label: "Fill in the Blanks" },
  { key: "true_false", label: "True / False" },
  { key: "short_answer", label: "Short Answer" },
  { key: "long_answer", label: "Long Answer" },
];

export default function QuestionTypeGrid({ config, setConfig }) {
  const update = (key, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const totalQ = TYPES.reduce((sum, t) => sum + (config[t.key]?.count || 0), 0);
  const totalM = TYPES.reduce((sum, t) => sum + (config[t.key]?.count || 0) * (config[t.key]?.marks || 0), 0);

  return (
    <div>
      {/* Column headers - hidden on mobile, each row becomes a labeled card instead */}
      <div className="mb-1 hidden grid-cols-[2fr_1fr_1fr_1fr] gap-2 text-xs font-semibold text-slate-500 sm:grid">
        <span>Type</span>
        <span>Count</span>
        <span>Marks</span>
        <span>Difficulty</span>
      </div>
      {TYPES.map((t) => (
        <div key={t.key} className="mb-3 rounded border border-slate-200 p-2 sm:mb-2 sm:rounded-none sm:border-0 sm:p-0">
          <span className="mb-1 block text-sm font-medium sm:hidden">{t.label}</span>
          <div className="grid grid-cols-3 items-center gap-2 sm:grid-cols-[2fr_1fr_1fr_1fr]">
            <span className="hidden text-sm sm:inline">{t.label}</span>
            <input
              type="number"
              min={0}
              className="input-field py-1"
              value={config[t.key]?.count ?? 0}
              onChange={(e) => update(t.key, "count", Number(e.target.value))}
            />
            <input
              type="number"
              min={1}
              className="input-field py-1"
              value={config[t.key]?.marks ?? 1}
              onChange={(e) => update(t.key, "marks", Number(e.target.value))}
            />
            <select
              className="input-field py-1"
              value={config[t.key]?.difficulty ?? "Medium"}
              onChange={(e) => update(t.key, "difficulty", e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
      ))}
      <p className="mt-2 text-sm text-slate-600">
        📊 Total Questions: <strong>{totalQ}</strong> &nbsp;|&nbsp; 🏆 Maximum Marks: <strong>{totalM}</strong>
      </p>
    </div>
  );
}

export const DEFAULT_QUESTION_CONFIG = {
  mcq: { count: 5, marks: 1, difficulty: "Easy" },
  fib: { count: 3, marks: 1, difficulty: "Easy" },
  true_false: { count: 3, marks: 1, difficulty: "Easy" },
  short_answer: { count: 3, marks: 2, difficulty: "Medium" },
  long_answer: { count: 2, marks: 5, difficulty: "Hard" },
};
