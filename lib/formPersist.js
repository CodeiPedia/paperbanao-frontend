// Lets an unauthenticated visitor fill in a page's form, then get
// redirected to sign up/log in when they click "Generate" — and land
// right back on their filled-in form afterward, instead of starting over.
const STORAGE_PREFIX = "paperbanao_pending_form:";

export function savePendingForm(pageKey, data) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + pageKey, JSON.stringify(data));
  } catch {
    // sessionStorage can fail in some private-browsing modes — if so, the
    // person just has to re-fill the form after logging in, which is a
    // minor inconvenience, not a broken flow.
  }
}

export function loadPendingForm(pageKey) {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + pageKey);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_PREFIX + pageKey);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
