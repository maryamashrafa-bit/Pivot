import { NextResponse } from 'next/server';

type Category =
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

function fallbackFor(title: string, context: string): string[] {
  return FALLBACK_BANKS[detectCategory(`${title} ${context}`)];
}

function buildPrompt(title: string, optA: string, optB: string, context: string) {
  return [
    'You are a thoughtful decision coach helping someone choose between two options. Work through the steps below privately, then output ONLY the final JSON array — no visible reasoning, no step labels, no commentary.',
    '',
    `DECISION: "${title}"`,
    `OPTION A: "${optA}"`,
    `OPTION B: "${optB}"`,
    context
      ? `PERSONAL CONTEXT (in their own words): "${context}"`
      : 'PERSONAL CONTEXT: none provided — work from the decision and options alone.',
    '',
    "STEP 1 — Read the decision title, both options, and the personal context TOGETHER as one picture of this person's life. Don't treat them as separate, unrelated inputs.",
    '',
    'STEP 2 — Classify the decision into exactly one category, judged from what it is actually about, not surface keywords: career, relationship, family, lifestyle, financial, health, education, or other. "Should I take the promotion or stay home with the baby" is a family decision wearing career clothing — classify by substance.',
    '',
    'STEP 3 — Generate exactly 12 short factor names (2-6 words each) this specific person would actually weigh, drawn from whichever of these fits the category you chose — using only the ones that genuinely fit this decision, made specific to it, not copied verbatim:',
    '  FAMILY (having/adopting a child, blending families, etc.): financial impact of a child, relationship with partner/co-parent, impact on existing children, emotional and mental readiness, support network, physical health and recovery, home and space needs, career flexibility needed, age gap between children, long-term family vision.',
    '  CAREER (new job, promotion, quitting, career change): salary and benefits, work-life balance, career growth, commute, team and manager quality, job security, skill development, industry outlook.',
    '  RELATIONSHIP (marriage, moving in together, breakup, long distance): emotional compatibility, shared life goals, communication patterns, family/social approval, financial entanglement, living arrangements, trust and history together.',
    '  LIFESTYLE (relocating, major life change, big purchase): cost of living, proximity to people you love, community fit, climate/environment, day-to-day routine impact, access to what you value.',
    '  FINANCIAL: immediate cost, long-term risk, income stability, opportunity cost, debt impact.',
    '  HEALTH: physical risk/benefit, recovery time, quality-of-life impact, cost of treatment, long-term outlook.',
    '  EDUCATION: cost and debt, career payoff, time commitment, personal fit, location/format.',
    '',
    'CRITICAL RULES — every one is mandatory:',
    `1. Every factor must be something a person could genuinely score DIFFERENTLY for "${optA}" versus "${optB}". If it would score the same for both, drop it.`,
    context
      ? '2. At least 8 of your 12 factors must clearly draw from something specific in the personal context above — a person, a timeline, a worry, a constraint, a place, anything they actually said. Use what they told you, don\'t paraphrase into generic themes.'
      : '2. No personal context was given, so draw all 12 factors from the decision, options, and category instead.',
    '3. Do NOT include career, job, salary, or work-related factors if this is a family, relationship, health, lifestyle, or education decision — UNLESS the person explicitly brought up their job, work, or work-related money in their own context. A decision about having another baby does not need "career growth" unless they raised it themselves.',
    '4. Every factor must be specific enough to feel personally meaningful when scored, not a bare, one-size-fits-all label. "Support network" alone is too generic; "Support network once the baby arrives" is specific and real. Filler like "overall fit", "long-term happiness", or "personal readiness" with nothing tying it to their actual situation is banned.',
    '5. Keep each factor to 2-6 words — short enough to read as a chip, specific enough to mean something.',
    '',
    'Return ONLY a valid JSON array of exactly 12 strings. No explanation, no markdown, no backticks.',
  ].join('\n');
}

// No auth required — this route doesn't touch any user's data, it just
// proxies to Anthropic so decisions can be started without an account.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
  const title = clip(body?.title, 300);
  const optA = clip(body?.optA, 300);
  const optB = clip(body?.optB, 300);
  const context = clip(body?.context, 2000);

  if (!title || !optA || !optB) {
    return NextResponse.json({ error: 'Missing decision details' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestions: fallbackFor(title, context) });
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 700,
        messages: [{ role: 'user', content: buildPrompt(title, optA, optB, context) }],
      }),
    });

    if (!r.ok) throw new Error(`Anthropic API error: ${r.status}`);

    const data = await r.json();
    const text = (data.content?.[0]?.text ?? '').trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed) && parsed.length >= 8) {
      return NextResponse.json({ suggestions: parsed });
    }
    throw new Error('Unexpected response shape');
  } catch {
    return NextResponse.json({ suggestions: fallbackFor(title, context) });
  }
}
