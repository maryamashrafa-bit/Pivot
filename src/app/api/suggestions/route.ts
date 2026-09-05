import { NextResponse } from 'next/server';
import { fallbackSuggestions } from '@/lib/fallback-suggestions';

function buildPrompt(title: string, optA: string, optB: string, context: string) {
  return [
    'You are a wise, empathetic friend who has listened carefully to everything this person has shared about their decision — their title, their two options, and their personal context. You know their specific situation. Your job is to suggest 12 factors they should consider when scoring this decision — factors that feel like they could only have been written by someone who truly understood their unique circumstances. Work through the steps below privately, then output ONLY the final JSON array — no visible reasoning, no step labels, no commentary.',
    '',
    `DECISION: "${title}"`,
    `OPTION A: "${optA}"`,
    `OPTION B: "${optB}"`,
    context
      ? `PERSONAL CONTEXT (in their own words): "${context}"`
      : 'PERSONAL CONTEXT: none provided — work from the decision and options alone.',
    '',
    'STEP 1 — DEEP READING. Mandatory, before you generate a single suggestion. Read the decision title carefully. Read both options carefully. Read every word of the personal context, if any was given. From that reading, identify: the specific circumstances they described, the specific constraints they are under (money, time, location, health, obligations), the specific relationships involved (by the actual details given — a 3-year-old, a partner who works long hours, a mother who lives 2 hours away — not generic labels), the specific emotions they expressed or implied (fear, guilt, excitement, grief, relief, resentment), and the specific practicalities they mentioned (logistics, timing, physical demands, day-to-day realities). Only generate suggestions that directly reflect what you actually read.',
    '',
    'STEP 2 — Classify the decision into exactly one category, judged from what it is actually about, not surface keywords: career change, having a child, relationship, education, starting a business, buying a home, relocation, retirement timing, caring for a family member, financial, health, lifestyle, or other/everyday. Classify by substance, not by what triggered it: moving to a new city for a partner\'s job is still relocation, not career; deciding whether to have a parent move in is still elder care, not family. Each of these categories carries its own distinct set of factors that a neighbouring category would miss.',
    '',
    'STEP 3 — THE PERSONALISATION TEST. Before generating each suggestion, ask: would I have suggested this if I had NOT read their personal context? If yes, it is too generic — make it specific to what they actually shared. A suggestion that would fit equally well in someone else\'s decision of the same type has failed this test.',
    '',
    'CATEGORY-SPECIFIC FACTOR LIBRARIES — use whichever fits as calibration for the kind of thing that matters here, then personalise every single one (see STEP 4). Never copy a library entry verbatim into your output.',
    '  CAREER CHANGE: salary and financial security, work-life balance, commute and location, career progression opportunities, job security, culture and values fit, autonomy and independence, sense of purpose and identity, impact on family, learning and development.',
    '  HAVING A CHILD (or another child): financial readiness, relationship stability, career impact, physical and emotional readiness, existing children\'s wellbeing, support network, housing and space, age and timing, childcare availability, long-term family vision.',
    '  RELATIONSHIP DECISIONS: shared values and future vision, communication and conflict resolution, emotional connection and intimacy, trust and respect, impact on children if applicable, financial entanglement, support network, personal happiness and fulfilment, future compatibility, physical and emotional safety.',
    '  EDUCATION (course or institution): career prospects and graduate employment, course content and quality, location and distance from home, cost and student debt, social life and culture, passion and interest in the subject, entry requirements, alternative pathways available.',
    '  STARTING A BUSINESS: financial runway and personal risk, market demand and competition, personal skills and experience match, time commitment required, impact on family and relationships, passion and long-term motivation, support network and mentorship, regulatory and legal environment.',
    '  BUYING A HOME: affordability and mortgage sustainability, location and commute, school catchment areas, size and future family needs, condition and renovation costs, neighbourhood and community feel, transport links, investment potential, proximity to family.',
    '  RELOCATION (moving city, moving country, choosing where to live — regardless of what triggered it): weather and climate, quality of schools, cost of living, business and career climate, tax environment, safety and crime rates, entertainment and social scene, proximity to family and friends.',
    '  RETIREMENT TIMING: financial readiness and pension sufficiency, health and energy levels, sense of purpose and identity post-retirement, relationship impact, what to do with your time, part-time or phased options, legacy and contribution, travel and lifestyle goals.',
    '  CARING FOR AN ELDERLY PARENT (or other family member): physical and emotional capacity, financial implications, impact on your own family, quality of professional care available, geographical proximity, relationship dynamics, long-term sustainability, professional support options.',
    '  FINANCIAL (a standalone money decision not covered above): immediate cost, long-term risk, income stability, opportunity cost, debt impact, peace of mind.',
    '  HEALTH: physical risk/benefit, recovery time, quality-of-life impact, cost of treatment, long-term outlook, mental health impact.',
    '  LIFESTYLE (a life change not covered above — downsizing, a big purchase, a new pursuit): values alignment, social connections and community, sense of belonging, practical adaptation to the change, financial implications, identity shift.',
    '  EVERYDAY AND SMALL DECISIONS: keep it light, practical, and proportionate — do NOT apply heavyweight life-decision factors (identity, long-term vision, financial runway) to a simple choice like what to do this evening or a minor purchase. See STEP 6.',
    '',
    'STEP 4 — THE PERSONALISATION RULE. Never use a factor verbatim from a library — always adapt it to reflect what the person actually shared.',
    '  Generic: "Financial impact" — Personalised: "Whether 6 months of savings is enough runway given your mortgage and your 4 year old\'s needs" (using whatever numbers and details THIS person actually gave)',
    '  Generic: "Impact on children" — Personalised: "How your two teenagers would feel about their grandmother moving into the spare room" (using whatever ages, relationships and living situation THIS person actually described)',
    '  Generic: "Work-life balance" — Personalised: "Whether the alternate-week on-call commitment is sustainable alongside your young family long term" (using whatever schedule and family details THIS person actually gave)',
    ...(context
      ? []
      : ['  (No personal context was given for this decision, so personalise as far as you can from the title and options alone — a named city, a named role, a named option — rather than leaving factors as bare library entries.)']),
    '',
    'STEP 5 — THE DEPTH REQUIREMENT. At least 8 of the 12 factors you produce MUST directly reference or respond to something the person actually wrote in their context — a detail, a name, an age, a number, a feeling, a constraint. For anything beyond a small everyday decision, include BOTH practical factors (logistics, finances, timing) AND emotional or relational factors (identity, fear, connection, values) — big decisions involve both, and a list of only one or the other has failed this step.',
    '',
    'STEP 6 — SCALE AWARENESS. Match the weight of your suggestions to the weight of the decision. A decision about going for a run this evening should get light, simple, low-stakes suggestions — mood, energy, what else is going on tonight — never identity, long-term vision, or financial runway. A decision about leaving the NHS for a corporate role should get suggestions with genuine depth and nuance — the kind that take a sentence to say because the situation deserves it. Read the decision\'s actual stakes from the title, options, and context, and calibrate every suggestion to match, regardless of category.',
    '',
    'Generate exactly 12 factors. For anything beyond a small everyday decision, each should read as a specific, complete thought — long enough to carry real meaning (a short clause or sentence, not just 2-3 words), short enough to read at a glance. Bare one-or-two-word labels are banned outright at any scale, but a small decision\'s factors should still be short and light, not padded out with false weight.',
    '',
    'CRITICAL RULES — every one is mandatory:',
    `1. Every factor must be something a person could genuinely score DIFFERENTLY for "${optA}" versus "${optB}". If it would score the same for both, drop it.`,
    '2. Do NOT include career, job, salary, or work-related factors unless the decision is fundamentally about career, business, or retirement, OR the person explicitly brought up their job, work, or work-related money in their own context. A relocation or family decision triggered by a job offer counts as explicitly raised — the career angle stays in for that specific detail, but don\'t invent unrelated career factors beyond it.',
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
        max_tokens: 2000,
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
