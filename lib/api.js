const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg).join(", ")
      : data.detail || "Something went wrong. Please try again.";
    // A 401 here means this token is no longer valid — either it expired,
    // or (if it's the specific single-device message) a newer login on
    // another device superseded it. Either way the person needs to log in
    // again; broadcasting this lets AuthContext force a logout + show why,
    // from wherever in the app the failing request happened to be.
    if (res.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("paperbanao:unauthorized", { detail: { message } }));
    }
    throw new Error(message);
  }
  return data;
}

export const api = {
  getMe: () => request("/auth/me"),

  signup: (username, email, password) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify({ username, email, password }) }),

  verifySignupOtp: (email, otp) =>
    request("/auth/verify-signup", { method: "POST", body: JSON.stringify({ email, otp }) }),

  resendSignupOtp: (email) =>
    request("/auth/resend-signup-otp", { method: "POST", body: JSON.stringify({ identifier: email }) }),

  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),

  requestPasswordReset: (identifier) =>
    request("/auth/request-password-reset", { method: "POST", body: JSON.stringify({ identifier }) }),

  resetPassword: (identifier, otp, new_password) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ identifier, otp, new_password }) }),

  generatePaper: (payload) =>
    request("/papers/generate", { method: "POST", body: JSON.stringify(payload) }),

  extractPdf: async (file, startPage, endPage) => {
    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("start_page", startPage);
    formData.append("end_page", endPage);
    const res = await fetch(`${API_URL}/papers/extract-pdf`, { method: "POST", headers, body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Couldn't extract text from that PDF.");
    return data;
  },

  getHistory: () => request("/papers/history"),

  savePaper: (payload) =>
    request("/papers/history", { method: "POST", body: JSON.stringify(payload) }),

  deletePaper: (id) => request(`/papers/history/${id}`, { method: "DELETE" }),

  getClasses: () => request("/curriculum/classes"),

  getSubjects: (className) =>
    request(`/curriculum/subjects?class_name=${encodeURIComponent(className)}`),

  getChapters: (className, subjectName) =>
    request(
      `/curriculum/chapters?class_name=${encodeURIComponent(className)}&subject_name=${encodeURIComponent(subjectName)}`
    ),

  getWeightage: (className, subjectName) =>
    request(
      `/curriculum/weightage?class_name=${encodeURIComponent(className)}&subject_name=${encodeURIComponent(subjectName)}`
    ),

  saveChapters: (className, subjectName, chapters) =>
    request("/curriculum/chapters", {
      method: "POST",
      body: JSON.stringify({ class_name: className, subject_name: subjectName, chapters }),
    }),

  getInstitutionDefaults: () => request("/institution/defaults"),

  saveInstitutionDefaults: async (formData) => {
    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/institution/defaults`, {
      method: "POST",
      headers,
      body: formData, // FormData — don't set Content-Type, browser sets the boundary
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Something went wrong.");
    return data;
  },

  exportPaper: async (fmt, payload) => {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/export/${fmt}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Export failed.");
    }
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="(.+)"/);
    const filename = match ? match[1] : `paper.${fmt}`;
    return { blob, filename };
  },

  digitize: async (files) => {
    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    const res = await fetch(`${API_URL}/digitize`, { method: "POST", headers, body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Digitize failed.");
    return data;
  },

  createPaymentLink: () => request("/payments/create-link", { method: "POST" }),

  regenerateQuestion: (oldText, subject, topics) =>
    request("/papers/regenerate-question", {
      method: "POST",
      body: JSON.stringify({ old_text: oldText, subject, topics }),
    }),

  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),

  supportChat: (message, history) =>
    request("/support/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),

  verifyPaymentCallback: (params) =>
    request("/payments/verify-callback", { method: "POST", body: JSON.stringify(params) }),
};

export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
