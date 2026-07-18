export type ScoreMap = Record<string, number>;
export type WeightMap = Record<string, number>;

export interface DecisionState {
  title: string;
  optA: string;
  optB: string;
  context: string;
  crit: string[];
  wts: WeightMap;
  scA: ScoreMap;
  scB: ScoreMap;
  suggestions: string[];
}

export interface SavedDecision {
  id: string;
  user_id: string;
  title: string;
  option_a: string;
  option_b: string;
  context: string;
  criteria: string[];
  weights: WeightMap;
  scores_a: ScoreMap;
  scores_b: ScoreMap;
  score_a: number;
  score_b: number;
  winner: string;
  created_at: string;
}

export function emptyDecisionState(): DecisionState {
  return {
    title: '',
    optA: '',
    optB: '',
    context: '',
    crit: [],
    wts: {},
    scA: {},
    scB: {},
    suggestions: [],
  };
}
