import type { ScoreMap, WeightMap } from '@/lib/types';

export interface ScoringResult {
  scoreA: number;
  scoreB: number;
  aWins: boolean;
  winner: string;
  loser: string;
  diff: number;
  sorted: string[];
  top3: string[];
  topWins: string[];
  topLose: string[];
  topTied: string[];
  biggest: string | null;
  biggestGapHolder: string;
  closingMessage: string;
}

export function computeResults(
  optA: string,
  optB: string,
  crit: string[],
  wts: WeightMap,
  scA: ScoreMap,
  scB: ScoreMap
): ScoringResult {
  const tw = crit.reduce((s, c) => s + (wts[c] ?? 5), 0) || 1;
  let sA = 0;
  let sB = 0;
  crit.forEach((c) => {
    const w = (wts[c] ?? 5) / tw;
    sA += w * (scA[c] ?? 5);
    sB += w * (scB[c] ?? 5);
  });

  const diff = Math.abs(sA - sB);
  const aWins = sA >= sB;
  const winner = aWins ? optA : optB;
  const loser = aWins ? optB : optA;
  const scW = aWins ? scA : scB;
  const scL = aWins ? scB : scA;

  const sorted = [...crit].sort((a, b) => (wts[b] ?? 5) - (wts[a] ?? 5));
  const top3 = sorted.slice(0, 3);

  const topWins = top3.filter((c) => scW[c] > scL[c]);
  const topLose = top3.filter((c) => scL[c] > scW[c]);
  const topTied = top3.filter((c) => scW[c] === scL[c]);

  const biggest = crit.reduce<string | null>((best, c) => {
    if (best === null) return c;
    return Math.abs((scA[c] ?? 5) - (scB[c] ?? 5)) > Math.abs((scA[best] ?? 5) - (scB[best] ?? 5))
      ? c
      : best;
  }, null);

  const biggestGapHolder =
    biggest && (scA[biggest] ?? 5) > (scB[biggest] ?? 5) ? optA : optB;

  let closingMessage: string;
  if (diff < 0.3) {
    closingMessage =
      'The scores are very close — and that’s meaningful. It tells you both options genuinely serve your values right now. The decision comes down to your gut, your timing, and your appetite for change. Neither choice is wrong.';
  } else if (diff < 1) {
    closingMessage = `"${winner}" has a meaningful lead. But before you decide — is there anything about "${loser}" that still pulls at you? If so, that feeling deserves attention too.`;
  } else {
    closingMessage = `"${winner}" leads clearly based on what matters most to you right now. You've done the honest work of putting your values on the page. Give yourself permission to trust that.`;
  }

  return {
    scoreA: sA,
    scoreB: sB,
    aWins,
    winner,
    loser,
    diff,
    sorted,
    top3,
    topWins,
    topLose,
    topTied,
    biggest,
    biggestGapHolder,
    closingMessage,
  };
}
