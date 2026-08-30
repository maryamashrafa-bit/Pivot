// Deterministic, keyword/pattern-based safeguarding checks run against the
// decision title, both options, and personal context as they're collected.
// This is intentionally NOT an AI call: it must work with no API key, with
// zero latency, and with 100% predictable behavior for a safety-critical
// path — a false negative here matters far more than an occasional false
// positive, so patterns are chosen to be specific enough to avoid firing on
// everyday phrasing ("should I change jobs", "give up on this project")
// while still catching the direct expressions this exists to catch.

const CRISIS_PATTERNS: RegExp[] = [
  // Suicide / not wanting to live
  /\bsuicid(e|al)\b/i,
  /\bkill(ing)? myself\b/i,
  /\bend(ing)? my (own )?life\b/i,
  /\bend(ing)? it all\b/i,
  /\btake my (own )?life\b/i,
  /\bwant(ed|ing)? to die\b/i,
  /\bbetter off dead\b/i,
  /\bno (reason|point) (to|in) liv(e|ing)\b/i,
  /\bdon'?t want to (be here|exist|wake up)( anymore| any more)?\b/i,
  /\bnot want(ing)? to (be here|exist|live)( anymore| any more)?\b/i,
  /\bwish I (was|were) dead\b/i,
  /\bcarry on living\b/i,
  /\blive or die\b/i,
  /\bwhether to live\b/i,
  /\bshould I (just )?die\b/i,
  // Self-harm
  /\bself[- ]?harm(ing|ed)?\b/i,
  /\b(cutting|hurting) myself\b/i,
  /\bthoughts of (suicide|self[- ]?harm|ending my life|hurting myself)\b/i,
  // Active crisis
  /\bcan'?t (go on|cope)( anymore| any more)?\b/i,
  /\bcan'?t take (it|this)( anymore| any more)?\b/i,
  // Risk to others
  /\b(kill|hurt|harm) (him|her|them|myself|someone|somebody)\b/i,
  /\bmake (him|her|them) (suffer|disappear)\b/i,
];

// Deliberately modest and high-confidence rather than exhaustive — enough
// to decline obviously inappropriate input without over-blocking ordinary
// decisions. Word-boundary matched, case-insensitive.
const INAPPROPRIATE_PATTERNS: RegExp[] = [
  /\bsex(ual(ly)?)? (fantasy|acts?|explicit)\b/i,
  /\bporn(ography)?\b/i,
  /\bnude(s)?\b/i,
  /\brape\b/i,
  /\bnigger\b/i,
  /\bfaggot\b/i,
  /\bretard(ed)?\b/i,
  /\bsubhuman\b/i,
  /\b(all|those) (jews|muslims|blacks|whites|gays|immigrants) (are|should)\b/i,
  /\bkill (all|the) \w+s\b/i,
];

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((p) => p.test(text));
}

export function isCrisisContent(text: string): boolean {
  if (!text.trim()) return false;
  return matchesAny(CRISIS_PATTERNS, text);
}

export function isInappropriateContent(text: string): boolean {
  if (!text.trim()) return false;
  return matchesAny(INAPPROPRIATE_PATTERNS, text);
}

export type SafetyFlag = 'crisis' | 'inappropriate' | null;

export function checkSafety(text: string): SafetyFlag {
  // Crisis takes priority if content somehow matches both.
  if (isCrisisContent(text)) return 'crisis';
  if (isInappropriateContent(text)) return 'inappropriate';
  return null;
}
