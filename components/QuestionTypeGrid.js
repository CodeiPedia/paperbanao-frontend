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
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 text-xs font-semibold text-slate-500 mb-1">
        <span>Type</span>
        <span>Count</span>
        <span>Marks</span>
        <span>Difficulty</span>
      </div>
      {TYPES.map((t) => (
        <div key={t.key} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 items-center mb-2">
          <span className="text-sm">{t.label}</span>
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
