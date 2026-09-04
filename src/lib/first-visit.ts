const KEY = 'pivotHasVisited';

// Guarded with try/catch: localStorage can throw (private browsing, storage
// disabled) — treating that as "first visit" is the safe fallback either way.
export function hasVisitedBefore(): boolean {
  try {
    return window.localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markVisited(): void {
  try {
    window.localStorage.setItem(KEY, '1');
  } catch {
    // ignore — nothing to fall back to if storage is unavailable
  }
}
