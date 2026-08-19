"use client";

// Converts **bold** markdown-style text into real <strong> tags, since the
// blocks come back as plain text with light markdown formatting from the AI.
function renderInline(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function PaperPreview({
  blocks,
  subject,
  className,
  marks,
  examTime,
  topics = "",
  institution = null, // { name, address, contact, teacherName, logoBase64, logoMimetype }
  customInstructions = "",
  readingTime = "",
}) {
  const answerKeyIndex = blocks.findIndex((b) => b.toUpperCase().includes("ANSWER KEY"));
  const questionBlocks = answerKeyIndex === -1 ? blocks : blocks.slice(0, answerKeyIndex);
  const answerBlocks = answerKeyIndex === -1 ? [] : blocks.slice(answerKeyIndex + 1);

  const instName = institution?.name || "PaperBanao";
  const instAddress = institution?.address || "";
  const instContact = institution?.contact || "";
  const teacherName = institution?.teacherName || "";
  const logoSrc =
    institution?.logoBase64 && institution?.logoMimetype
      ? `data:${institution.logoMimetype};base64,${institution.logoBase64}`
      : null;

  const topicHeading = (topics || subject || "").toUpperCase();

  return (
    <div className="print-area">
      <div className="letterhead-page">
        <div className="letterhead-watermark">{instName}</div>

        <div className="letterhead-header">
          <table className="letterhead-header-table">
            <tbody>
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  <div className="letterhead-brand-row">
                    {logoSrc && <img src={logoSrc} alt="" className="letterhead-logo" />}
                    <h1 className="letterhead-name">{instName}</h1>
                  </div>
                </td>
              </tr>
              <tr className="letterhead-meta-row">
                <td className="letterhead-meta-left">
                  Class : {className || "—"}
                  <br />
                  Time : {examTime || "2 Hours"}
                  {readingTime ? ` (+ ${readingTime} reading time)` : ""}
                </td>
                <td className="letterhead-meta-center">
                  <span className="letterhead-badge">EXAMINATION</span>
                </td>
                <td className="letterhead-meta-right">
                  Sub.: {subject || "—"}
                  <br />
                  Marks: {marks || "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="letterhead-section-bar">MULTIPLE CHOICE QUESTIONS &amp; THEORY</div>

        {topicHeading && <h2 className="letterhead-topic-heading">{topicHeading}</h2>}

        {customInstructions.trim() && (
          <div className="letterhead-instructions">
            <strong>Instructions:</strong> {customInstructions.trim()}
          </div>
        )}

        <div className="letterhead-content">
          {questionBlocks.map((b, i) => (
            <div key={i} className="letterhead-question">
              {renderInline(b)}
            </div>
          ))}
        </div>

        {answerBlocks.length > 0 && (
          <div className="letterhead-answer-section">
            <h2 className="letterhead-topic-heading letterhead-answer-heading">ANSWER KEY</h2>
            <div className="letterhead-content">
              {answerBlocks.map((b, i) => (
                <div key={i} className="letterhead-question">
                  {renderInline(b)}
                </div>
              ))}
            </div>
          </div>
        )}

        {(instAddress || instContact || teacherName) && (
          <div className="letterhead-footer">
            <strong>{instName}</strong>
            {instAddress && <> | Address: {instAddress}</>}
            {instContact && <> | Phone: {instContact}</>}
            {teacherName && (
              <>
                {" "}
                | Teacher: <strong>{teacherName}</strong>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
