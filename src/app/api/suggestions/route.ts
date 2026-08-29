import { NextResponse } from 'next/server';
import { fallbackSuggestions } from '@/lib/fallback-suggestions';

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
    'STEP 3 — Imagine you are a wise, empathetic friend who has just listened carefully to everything this person shared. What would YOU specifically suggest they consider — beyond the obvious? What unique factors emerge from THEIR specific situation that a generic list would miss? The test: could a factor have been generated without reading the personal context? If yes, it needs to be more specific and personal.',
    '',
    'Category reference — draw from whichever fits this decision, but treat these as a starting point to make specific, not a list to copy verbatim:',
    '  FAMILY (having/adopting a child, blending families, etc.): financial impact of a child, relationship with partner/co-parent, impact on existing children, emotional and mental readiness, support network, physical health and recovery, home and space needs, career flexibility needed, age gap between children, long-term family vision.',
    '  CAREER (new job, promotion, quitting, career change): salary and benefits, work-life balance, career growth, commute, team and manager quality, job security, skill development, industry outlook.',
    '  RELATIONSHIP (marriage, moving in together, breakup, long distance): emotional compatibility, shared life goals, communication patterns, family/social approval, financial entanglement, living arrangements, trust and history together.',
    '  LIFESTYLE (relocating, major life change, big purchase): cost of living, proximity to people you love, community fit, climate/environment, day-to-day routine impact, access to what you value.',
    '  FINANCIAL: immediate cost, long-term risk, income stability, opportunity cost, debt impact.',
    '  HEALTH: physical risk/benefit, recovery time, quality-of-life impact, cost of treatment, long-term outlook.',
    '  EDUCATION: cost and debt, career payoff, time commitment, personal fit, location/format.',
    '',
    context
      ? 'Generate exactly 12 factors (2-6 words each). The first 4-5 may be solid, standard factors for this type of decision. But AT LEAST 6-7 of the 12 must be genuinely specific to what THIS person actually told you — something a generic list for this decision type would never include. If they mentioned a toddler, don\'t write "family impact" — write something like "age gap impact on your toddler specifically". If they mentioned financial pressure, don\'t write "financial impact" — reflect the actual pressure they described, in their terms.'
      : 'No personal context was given, so generate exactly 12 factors (2-6 words each) drawn from the decision, options, and category above.',
    '',
    'CRITICAL RULES — every one is mandatory:',
    `1. Every factor must be something a person could genuinely score DIFFERENTLY for "${optA}" versus "${optB}". If it would score the same for both, drop it.`,
    '2. Do NOT include career, job, salary, or work-related factors if this is a family, relationship, health, lifestyle, or education decision — UNLESS the person explicitly brought up their job, work, or work-related money in their own context. A decision about having another baby does not need "career growth" unless they raised it themselves.',
    '3. Every factor must be specific enough to feel personally meaningful when scored, not a bare, one-size-fits-all label. "Support network" alone is too generic; "Support network once the baby arrives" is specific and real. Filler like "overall fit", "long-term happiness", or "personal readiness" with nothing tying it to their actual situation is banned.',
    '4. Keep each factor to 2-6 words — short enough to read as a chip, specific enough to mean something.',
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
    return NextResponse.json({ suggestions: fallbackSuggestions(title, context) });
  }
}
