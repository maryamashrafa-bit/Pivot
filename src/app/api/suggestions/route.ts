import { NextResponse } from 'next/server';
import { fallbackSuggestions } from '@/lib/fallback-suggestions';

function buildPrompt(title: string, optA: string, optB: string, context: string) {
  return [
    'You are a wise, empathetic friend who has just listened carefully to everything this person has shared about a big decision in their life. Work through the steps below privately, then output ONLY the final JSON array — no visible reasoning, no step labels, no commentary.',
    '',
    `DECISION: "${title}"`,
    `OPTION A: "${optA}"`,
    `OPTION B: "${optB}"`,
    context
      ? `PERSONAL CONTEXT (in their own words): "${context}"`
      : 'PERSONAL CONTEXT: none provided — work from the decision and options alone.',
    '',
    'STEP 1 — DEEP READING. Mandatory, before you generate a single suggestion. Read the decision title carefully. Read both options carefully. Read every word of the personal context, if any was given. From that reading, identify: the specific circumstances they described, the specific constraints they are under (money, time, location, health, obligations), the specific relationships involved (by the actual details given — a 3-year-old, a partner who works long hours, a VIP client — not generic labels), the specific emotions they expressed or implied (fear, guilt, excitement, grief, relief, resentment), and the specific practicalities they mentioned (logistics, timing, physical demands, day-to-day realities). Only generate suggestions that directly reflect what you actually read.',
    '',
    'STEP 2 — Classify the decision into exactly one category, judged from what it is actually about, not surface keywords: career, relationship, family, lifestyle, financial, health, education, or other. "Should I take the promotion or stay home with the baby" is a family decision wearing career clothing — classify by substance.',
    '',
    'STEP 3 — THE WISE, EMPATHETIC FRIEND TEST. You are a wise, empathetic friend who has just listened carefully to everything this person has shared. You know their specific situation intimately. Now suggest the factors that genuinely matter for THIS decision — not a generic decision of this type. Ask yourself before each suggestion: would I have suggested this if I had NOT read their personal context? If yes — it is too generic. Replace it with something that could only have been suggested after reading their specific situation.',
    '',
    'Category depth reference — go beyond the obvious within whichever category fits. Treat these as dimensions to mine for specifics, not a list to copy verbatim:',
    '  CAREER: identity as a professional, clinical/professional autonomy, peer relationships, sense of purpose, professional development, work culture, boundaries and on-call demands, income trajectory — as well as the standard salary, work-life balance, commute, job security.',
    '  FAMILY: relationship dynamics with a partner/co-parent, emotional readiness, practical day-to-day logistics, financial sustainability (not just cost), impact on existing children specifically, support network in real terms, physical demands and recovery, long-term family vision.',
    '  LIFESTYLE: values alignment, social connections and community, sense of belonging, practical adaptation to the change, financial implications, identity shift — as well as cost of living, commute, day-to-day routine.',
    '  RELATIONSHIP: emotional compatibility, shared long-term goals, communication patterns, family/social approval, financial entanglement, living arrangements, trust and history together.',
    '  FINANCIAL: immediate cost, long-term risk, income stability, opportunity cost, debt impact, peace of mind.',
    '  HEALTH: physical risk/benefit, recovery time, quality-of-life impact, cost of treatment, long-term outlook, mental health impact.',
    '  EDUCATION: cost and debt, career payoff, time commitment, personal fit, location/format, impact on current income and family life.',
    '',
    'STEP 4 — THE SPECIFICITY RULE. At least 8 of the 12 factors you produce MUST directly reference or respond to something the person actually wrote in their context — a detail, a name, an age, a number, a feeling, a constraint. Generic factors like "financial impact" or "emotional readiness" are only acceptable at all if the person specifically mentioned finances or emotions — and even then they must be rewritten to be specific to what was described, never left as the bare generic label.',
    context
      ? [
          '  Generic (banned): "Financial impact" — Specific (required): "Impact on paying off your mortgage given the salary difference you described"',
          '  Generic (banned): "Impact on children" — Specific (required): "How your 3-year-old will adapt to seeing less of you during the transition period" (using whatever detail THIS person actually gave)',
          '  Generic (banned): "Career progression" — Specific (required): "Whether the qualification pathway they promised is genuinely supported or just verbally promised" (using whatever detail THIS person actually gave)',
        ].join('\n')
      : '  (No personal context was given for this decision, so this rule cannot apply — draw the fullest, most concrete factors you can from the decision, options, and category depth reference instead.)',
    '',
    'STEP 5 — EMOTIONAL AND PRACTICAL BALANCE. For personal and family decisions especially, people are not just weighing logistics — they are weighing identity, relationships, values, and fears. Make sure both dimensions are represented: practical factors (money, logistics, time, health) AND emotional/relational ones (identity, fear of the unknown, sense of purpose, self-worth, relationships). Neither should be missing.',
    '',
    'STEP 6 — DEPTH OF LANGUAGE. Suggestions must feel weighty and considered, matching the weight of a big life decision — never like a generic checklist item.',
    '  Too simplistic: "Work-life balance" — Better: "Whether the on-call commitment every alternate week is sustainable alongside your young family long term" (adapted to what THIS person described)',
    '  Too simplistic: "Job satisfaction" — Better: "Whether a structured 9-5 environment will still feel fulfilling after years of the variety and autonomy you described" (adapted to what THIS person described)',
    '',
    context
      ? 'Generate exactly 12 factors. Each should read as a specific, complete thought — long enough to carry real meaning (a short clause or sentence, not just 2-3 words), short enough to read at a glance. Bare one-or-two-word labels are banned outright.'
      : 'No personal context was given, so generate exactly 12 solid, category-appropriate factors drawn from the decision, options, and category depth reference above — still avoid bare one-or-two-word labels; make each one a specific, complete thought.',
    '',
    'CRITICAL RULES — every one is mandatory:',
    `1. Every factor must be something a person could genuinely score DIFFERENTLY for "${optA}" versus "${optB}". If it would score the same for both, drop it.`,
    '2. Do NOT include career, job, salary, or work-related factors if this is a family, relationship, health, lifestyle, or education decision — UNLESS the person explicitly brought up their job, work, or work-related money in their own context. A decision about having another baby does not need "career growth" unless they raised it themselves.',
    '3. No filler. "Overall fit", "long-term happiness", "personal readiness", or any other phrase with nothing tying it to this person\'s actual situation is banned.',
    '4. Before finalizing, count how many of your 12 factors directly reference something specific from the context. If it is fewer than 8, rewrite the weakest, most generic ones until it is at least 8.',
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
    return NextResponse.json({ suggestions: fallbackSuggestions(title, context) });
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
        max_tokens: 1600,
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
    return NextResponse.json({ suggestions: fallbackSuggestions(title, context) });
  }
}
