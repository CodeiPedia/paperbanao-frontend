"use client";

// Converts **bold** markdown-style text into real <strong> tags, and
// {{DIAGRAM:id}} markers (inserted by the backend where the AI requested
// a diagram) into actual <img> tags, since the blocks come back as plain
// text with this light formatting from the AI/backend.
function renderInline(text, diagrams = {}) {
  const pattern = /\*\*(.*?)\*\*|\{\{DIAGRAM:(\w+)\}\}/g;
  const result = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[1] !== undefined) {
      result.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      const imgData = diagrams[match[2]];
      if (imgData) {
        result.push(
          <img
            key={key++}
            src={`data:image/png;base64,${imgData}`}
            alt="Diagram"
            className="letterhead-diagram-image"
          />
        );
      }
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    result.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return result;
}

// Topics from the BSEB curriculum picker come formatted like
// "Subject: Chapter A; Subject: Chapter B" (one "Subject: " prefix per
// chapter, repeated). For the printed heading we only want the chapter
// names, not the subject repeated in front of every single one.
function formatTopicHeading(topics, subject) {
  const raw = (topics || subject || "").trim();
  if (!raw) return "";
  const parts = raw.split(";").map((part) => {
    const trimmed = part.trim();
    const colonIdx = trimmed.indexOf(":");
    return colonIdx > -1 ? trimmed.slice(colonIdx + 1).trim() : trimmed;
  });
  return parts.join("; ").toUpperCase();
}

// If className already starts with "Class" (e.g. "Class 10", from a
// dropdown), strip that prefix before display — the "Class :" label is
// added separately, so otherwise it would print as "Class : Class 10".
function formatClassName(className) {
  const trimmed = (className || "").trim();
  return trimmed.replace(/^class\s*/i, "").trim();
}

function Letterhead({ instName, logoSrc, className, examTime, readingTime, marks, subject }) {
  return (
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
              Class : {formatClassName(className) || "—"}
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
  );
}

function Footer({ instName, instAddress, instContact, teacherName }) {
  if (!instAddress && !instContact && !teacherName) return null;
  return (
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
  diagrams = {}, // { diagram_1: base64PngData, ... } — from the generate/regenerate API response
}) {
  const answerKeyIndex = blocks.findIndex((b) => b.toUpperCase().includes("ANSWER KEY"));
  const questionBlocks = answerKeyIndex === -1 ? blocks : blocks.slice(0, answerKeyIndex);
  // The block containing "ANSWER KEY" sometimes also contains the very
  // first answer (e.g. the AI writes "# ANSWER KEY\nQ1. (c) ...\n" as one
  // combined block instead of putting the header on its own line separated
  // by |||). Simply skipping this whole block would silently drop Q1's
  // answer — so strip out just the header line(s) and keep any remaining
  // text as the first answer entry.
  let answerBlocks = [];
  if (answerKeyIndex !== -1) {
    const markerBlock = blocks[answerKeyIndex];
    const afterHeader = markerBlock
      .split("\n")
      .filter((line) => !line.toUpperCase().includes("ANSWER KEY"))
      .join("\n")
      .trim();
    const remainingBlocks = blocks.slice(answerKeyIndex + 1);
    answerBlocks = afterHeader ? [afterHeader, ...remainingBlocks] : remainingBlocks;
  }

  const instName = institution?.name || "PaperBanao";
  const instAddress = institution?.address || "";
  const instContact = institution?.contact || "";
  const teacherName = institution?.teacherName || "";
  const logoSrc =
    institution?.logoBase64 && institution?.logoMimetype
      ? `data:${institution.logoMimetype};base64,${institution.logoBase64}`
      : null;

  const topicHeading = formatTopicHeading(topics, subject);
  const footerProps = { instName, instAddress, instContact, teacherName };

  return (
    <div className="print-area">
      <div className="letterhead-page">
        <div className="letterhead-watermark">{instName}</div>

        {/* Questions "page" — its own table so the footer (tfoot) reliably
            repeats at the bottom of every physical printed page this
            section spans, while the header above appears only once, at
            the very top — not repeated per page. */}
        <table className="letterhead-table">
          <thead><tr><td /></tr></thead>
          <tbody>
            <tr>
              <td>
                <Letterhead
                  instName={instName}
                  logoSrc={logoSrc}
                  className={className}
                  examTime={examTime}
                  readingTime={readingTime}
                  marks={marks}
                  subject={subject}
                />
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
                      {renderInline(b, diagrams)}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot className="letterhead-tfoot">
            <tr><td><Footer {...footerProps} /></td></tr>
          </tfoot>
        </table>

        {/* Answer Key "page" — a separate table (page-break-before on the
            table itself, not inside a row) with its own once-only header
            and its own repeating footer. */}
        {answerBlocks.length > 0 && (
          <table className="letterhead-table letterhead-answer-table">
            <thead><tr><td /></tr></thead>
            <tbody>
              <tr>
                <td>
                  <div className="letterhead-simple-header">{instName}</div>
                  <h2 className="letterhead-topic-heading letterhead-answer-heading">ANSWER KEY</h2>
                  <div className="letterhead-content">
                    {answerBlocks.map((b, i) => (
                      <div key={i} className="letterhead-question">
                        {renderInline(b, diagrams)}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot className="letterhead-tfoot">
              <tr><td><Footer {...footerProps} /></td></tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
