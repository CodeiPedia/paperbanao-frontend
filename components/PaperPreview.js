"use client";

// Converts **bold** markdown-style text into real <strong> tags, since the
// blocks come back as plain text with light markdown formatting from the AI.
function renderInline(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function PaperPreview({ blocks, subject, className, marks, examTime }) {
  const answerKeyIndex = blocks.findIndex((b) => b.toUpperCase().includes("ANSWER KEY"));
  const questionBlocks = answerKeyIndex === -1 ? blocks : blocks.slice(0, answerKeyIndex);
  const answerBlocks = answerKeyIndex === -1 ? [] : blocks.slice(answerKeyIndex + 1);

  return (
    <div className="paper-sheet">
      <div className="paper-sheet-header">
        <div className="subject">{subject || "Question Paper"}</div>
        <div className="meta">
          {className ? `Class: ${className}` : ""}
          {marks ? `  |  Marks: ${marks}` : ""}
          {examTime ? `  |  Time: ${examTime}` : ""}
        </div>
      </div>

      {questionBlocks.map((b, i) => (
        <div key={i} className="paper-question">
          {renderInline(b)}
        </div>
      ))}

      {answerBlocks.length > 0 && (
        <>
          <div className="answer-key-divider">Answer Key</div>
          {answerBlocks.map((b, i) => (
            <div key={i} className="answer-key-question">
              {renderInline(b)}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
