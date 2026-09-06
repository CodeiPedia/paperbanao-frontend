"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { SkeletonForm } from "@/components/Skeleton";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

export default function InstitutionSettingsPage() {
  const [instName, setInstName] = useState("");
  const [instAddress, setInstAddress] = useState("");
  const [instContact, setInstContact] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [language, setLanguage] = useState("English");
  const [boardFormat, setBoardFormat] = useState("Standard");
  const [customInstructions, setCustomInstructions] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [logoPlacement, setLogoPlacement] = useState("left");
  const [headingFont, setHeadingFont] = useState("serif");
  const [headingSize, setHeadingSize] = useState("medium");
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api.getInstitutionDefaults()
      .then((d) => {
        setInstName(d.default_inst_name || "");
        setInstAddress(d.default_inst_address || "");
        setInstContact(d.default_inst_contact || "");
        setTeacherName(d.default_teacher_name || "");
        setLanguage(d.default_paper_language || "English");
        setBoardFormat(d.default_board_format || "Standard");
        setCustomInstructions(d.default_custom_instructions || "");
        setReadingTime(d.default_reading_time || "");
        setLogoPlacement(d.default_logo_placement || "left");
        setHeadingFont(d.default_heading_font || "serif");
        setHeadingSize(d.default_heading_size || "medium");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("inst_name", instName);
      formData.append("inst_address", instAddress);
      formData.append("inst_contact", instContact);
      formData.append("teacher_name", teacherName);
      formData.append("paper_language", language);
      formData.append("board_format", boardFormat);
      formData.append("custom_instructions", customInstructions);
      formData.append("reading_time", readingTime);
      formData.append("logo_placement", logoPlacement);
      formData.append("heading_font", headingFont);
      formData.append("heading_size", headingSize);
      if (logoFile) formData.append("logo", logoFile);

      await api.saveInstitutionDefaults(formData);
      showToast("Saved! These will auto-fill on every paper you generate or export.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="eyebrow mb-1">Your letterhead</div>
        <h1 className="mb-2 text-2xl">Institute Details</h1>
        <p className="mb-6 text-sm text-slate-500">
          Save your letterhead once — every paper you generate or export will use it automatically.
        </p>

        {loading ? (
          <SkeletonForm rows={5} />
        ) : (
          <form onSubmit={handleSave} className="card space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Institute Name</label>
              <input className="input-field" value={instName} onChange={(e) => setInstName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Address</label>
              <input className="input-field" value={instAddress} onChange={(e) => setInstAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Contact Number</label>
                <input className="input-field" value={instContact} onChange={(e) => setInstContact(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Teacher Name</label>
                <input className="input-field" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Default Language</label>
                <select className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Bilingual</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Board Pattern</label>
                <select className="input-field" value={boardFormat} onChange={(e) => setBoardFormat(e.target.value)}>
                  <option>Standard</option>
                  <option>BSEB (Bihar Board)</option>
                  <option>CBSE</option>
                  <option>ICSE</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Logo</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="file-input-btn"
              />
              <p className="mt-1 text-xs text-slate-400">Leave empty to keep your current saved logo.</p>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h2 className="mb-1 text-base font-semibold text-[#17263D]">Header Style</h2>
              <p className="mb-3 text-xs text-slate-400">Choose how your logo and institute name look on generated papers.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Logo Placement</label>
                  <select className="input-field" value={logoPlacement} onChange={(e) => setLogoPlacement(e.target.value)}>
                    <option value="left">Left of name</option>
                    <option value="right">Right of name</option>
                    <option value="above">Above name</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Heading Font</label>
                  <select className="input-field" value={headingFont} onChange={(e) => setHeadingFont(e.target.value)}>
                    <option value="serif">Classic Serif</option>
                    <option value="sans">Modern Sans-serif</option>
                    <option value="bold-display">Bold Display</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Heading Size</label>
                  <select className="input-field" value={headingSize} onChange={(e) => setHeadingSize(e.target.value)}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h2 className="mb-1 text-base font-semibold text-[#17263D]">Paper Format</h2>
              <p className="mb-3 text-xs text-slate-400">Optional — shown at the top of every generated paper.</p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Custom Instructions</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. All questions are compulsory. Section A carries 20 marks."
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Reading Time (optional)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 15 minutes"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? "Saving..." : "💾 Save Defaults"}
            </button>
          </form>
        )}
      </main>
    </ProtectedRoute>
  );
}
