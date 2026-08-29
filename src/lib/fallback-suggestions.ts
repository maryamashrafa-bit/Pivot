export type Category =
  | 'family'
  | 'relationship'
  | 'career'
  | 'lifestyle'
  | 'financial'
  | 'health'
  | 'education'
  | 'general';

const FALLBACK_BANKS: Record<Category, string[]> = {
  family: [
    'Financial impact of a child',
    'Relationship with your partner',
    'Impact on existing children',
    'Emotional and mental readiness',
    'Support network nearby',
    'Physical health and recovery',
    'Home and space needs',
    'Career flexibility needed',
    'Age gap between children',
    'Long-term family vision',
    'Childcare arrangements',
    'Impact on daily routine',
  ],
  career: [
    'Salary and benefits',
    'Work-life balance',
    'Career growth potential',
    'Commute time',
    'Team and manager quality',
    'Job security',
    'Skill development opportunities',
    'Industry outlook',
    'Company culture fit',
    'Flexibility and remote options',
    'Workload and stress level',
    'Alignment with long-term goals',
  ],
  relationship: [
    'Emotional compatibility',
    'Shared long-term goals',
    'Communication patterns',
    'Family and social approval',
    'Financial entanglement',
    'Living arrangement fit',
    'Trust and relationship history',
    'Conflict resolution style',
    'Independence and personal space',
    'Timing in both your lives',
    'Support during hard times',
    'Vision for the future together',
  ],
  lifestyle: [
    'Cost of living difference',
    'Proximity to family and friends',
    'Community and social fit',
    'Climate and environment',
    'Day-to-day routine impact',
    'Access to things you value',
    'Job market in the new place',
    'Housing options and space',
    'Sense of adventure vs stability',
    'Ease of the transition itself',
    'Impact on current relationships',
    'Long-term satisfaction with the change',
  ],
  financial: [
    'Immediate cost',
    'Long-term financial risk',
    'Income stability',
    'Opportunity cost',
    'Debt impact',
    'Savings and emergency buffer',
    'Tax implications',
    'Return on investment',
    'Flexibility if plans change',
    'Impact on retirement plans',
    'Day-to-day cash flow',
    'Peace of mind',
  ],
  health: [
    'Physical risk and benefit',
    'Recovery time',
    'Quality of life impact',
    'Cost of treatment',
    'Long-term health outlook',
    'Impact on daily energy',
    'Side effects to manage',
    'Access to follow-up care',
    'Family history considerations',
    'Mental health impact',
    'Time away from normal life',
    'Confidence in the medical advice',
  ],
  education: [
    'Cost and debt involved',
    'Career payoff',
    'Time commitment required',
    'Personal interest and fit',
    'Location and format',
    'Reputation of the program',
    'Networking opportunities',
    'Impact on current income',
    'Balance with family life',
    'Long-term skill relevance',
    'Flexibility of the schedule',
    'Support available while studying',
  ],
  general: [
    'Financial impact',
    'Time commitment',
    'Emotional impact',
    'Impact on people close to you',
    'Long-term vs short-term outcome',
    'Reversibility if it doesn’t work out',
    'Effort required to make it work',
    'Alignment with your values',
    'Risk involved',
    'Effect on your daily routine',
    'Support available to you',
    'How ready you feel right now',
  ],
};

const CATEGORY_KEYWORDS: Record<Exclude<Category, 'general'>, string[]> = {
  family: [
    'child', 'children', 'kid', 'kids', 'baby', 'babies', 'pregnan', 'adopt',
    'parent', 'newborn', 'toddler', 'son', 'daughter',
  ],
  relationship: [
    'partner', 'marry', 'marriage', 'boyfriend', 'girlfriend', 'spouse',
    'relationship', 'divorce', 'breakup', 'dating', 'fiance', 'fiancé',
  ],
  health: [
    'health', 'medical', 'surgery', 'therapy', 'diagnosis', 'illness',
    'treatment', 'doctor', 'symptom',
  ],
  education: [
    'school', 'university', 'college', 'degree', 'study', 'studies',
    'course', 'major', 'phd', 'masters',
  ],
  financial: [
    'invest', 'mortgage', 'loan', 'debt', 'savings', 'budget', 'financial',
    'afford',
  ],
  lifestyle: ['move', 'moving', 'relocat', 'city', 'travel', 'lifestyle'],
  career: [
    'job', 'career', 'work', 'promotion', 'salary', 'employer', 'resign',
    'quit', 'boss', 'coworker',
  ],
};

function detectCategory(text: string): Category {
  const t = text.toLowerCase();
  let best: Category = 'general';
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = category as Category;
    }
  }
  return best;
}

// The static fallback (no API key, or the AI call failed) can't reason
// about the context like the prompt does, but it shouldn't be flatly
// generic either — a few keyword-triggered hooks let it nod to specifics
// the person actually mentioned instead of reading like a form.
const CONTEXT_HOOKS: { test: RegExp; factor: string }[] = [
  { test: /toddler/i, factor: 'Impact on your toddler specifically' },
  { test: /newborn|infant/i, factor: 'Adjusting to a newborn again' },
  { test: /\bbabies|\bbaby\b/i, factor: 'How this affects your baby' },
  { test: /mortgage/i, factor: 'Your mortgage payments specifically' },
  { test: /\brent\b/i, factor: 'Your rent payments specifically' },
  { test: /\bdebt\b/i, factor: 'The debt you mentioned' },
  { test: /savings/i, factor: 'Your current savings cushion' },
  { test: /\bpartner\b|\bspouse\b|\bhusband\b|\bwife\b/i, factor: 'How this affects your partner specifically' },
  { test: /\bmum\b|\bmom\b|\bdad\b|\bparents?\b/i, factor: 'The family support you mentioned' },
  { test: /\bpet\b|\bdog\b|\bcat\b/i, factor: 'Impact on your pet' },
  { test: /remote/i, factor: 'The remote flexibility you have' },
  { test: /\bcommute\b/i, factor: 'The commute you described' },
  { test: /friends?/i, factor: 'Distance from the friends you mentioned' },
  { test: /apartment|\bflat\b/i, factor: 'Space in your current home' },
  { test: /anxious|anxiety|worried|worry|scared|nervous/i, factor: 'The worry you described' },
  { test: /excited|hopeful|looking forward/i, factor: 'The excitement you mentioned' },
];

function contextHooks(context: string, max = 4): string[] {
  if (!context) return [];
  const hits: string[] = [];
  for (const hook of CONTEXT_HOOKS) {
    if (hook.test.test(context) && !hits.includes(hook.factor)) {
      hits.push(hook.factor);
      if (hits.length >= max) break;
    }
  }
  return hits;
}

// Used both server-side (route.ts, when the AI call is unavailable or
// fails) and client-side (DecisionChat.tsx, when the fetch to our own
// route fails outright) so there's only ever one fallback list to keep
// category-aware and personalized — not a generic one on each side.
export function fallbackSuggestions(title: string, context: string): string[] {
  const base = FALLBACK_BANKS[detectCategory(`${title} ${context}`)];
  const hooks = contextHooks(context);
  if (hooks.length === 0) return base;

  // Keep the first few as category staples, thread the context-specific
  // hooks in after that, and hold the total at 12.
  const merged = [...base];
  hooks.forEach((hook, i) => {
    merged.splice(Math.max(4, merged.length - hooks.length + i), 0, hook);
  });
  return merged.slice(0, 12);
}
