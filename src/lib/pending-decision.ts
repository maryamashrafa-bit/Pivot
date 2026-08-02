import type { DecisionResultPayload } from '@/lib/types';

const KEY = 'pivot:pending-decision';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

interface StoredPendingDecision {
  savedAt: number;
  data: DecisionResultPayload;
}

// A decision finished without an account lives here only long enough for
// the person to sign up and have it saved for real — never sent anywhere,
// never touched by anyone but this browser.
export function storePendingDecision(data: DecisionResultPayload) {
  try {
    const entry: StoredPendingDecision = { savedAt: Date.now(), data };
    window.localStorage.setItem(KEY, JSON.stringify(entry));
  } catch {
    // localStorage unavailable (private browsing, etc.) — nothing to do.
  }
}

export function takePendingDecision(): DecisionResultPayload | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    window.localStorage.removeItem(KEY);

    const entry = JSON.parse(raw) as StoredPendingDecision;
    if (!entry?.data || Date.now() - entry.savedAt > MAX_AGE_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}
