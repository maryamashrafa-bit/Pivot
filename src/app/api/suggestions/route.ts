import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FALLBACK_SUGGESTIONS = [
  'Daily time commitment',
  'Financial impact',
  'Career progression',
  'Job security',
  'Family time impact',
  'Commute demands',
  'Side project time',
  'Work flexibility',
  'Team environment',
  'Learning opportunities',
  'Pension & benefits',
  'Entrepreneurial freedom',
];

function buildPrompt(title: string, optA: string, optB: string, context: string) {
  return [
    'You are helping someone make a real decision. Your job is to generate 12 decision factors as short chips (2-5 words each).',
    '',
    `DECISION: "${title}"`,
    `OPTION A: "${optA}"`,
    `OPTION B: "${optB}"`,
    context ? `PERSONAL CONTEXT: "${context}"` : 'PERSONAL CONTEXT: none provided',
    '',
    'CRITICAL RULES — you must follow every one of these:',
    `1. Every factor must be DIRECTLY relevant to choosing between "${optA}" and "${optB}" specifically.`,
    '2. If personal context is provided, AT LEAST 6 of your 12 factors must directly reference or reflect something mentioned in that context. Do not ignore the context.',
    '3. NEVER generate generic factors like "long-term happiness", "personal readiness", "overall fit", "emotional connection", "support network". These are banned.',
    '4. Each factor must be something a person could actually SCORE differently for each option.',
    '5. Be specific. "Impact on side business" is good. "Work-life balance" alone is too vague — write "Side business time impact" instead.',
    '6. Think like a thoughtful friend who just read everything above and is naming the real things that matter.',
    '',
    'Return ONLY a valid JSON array of exactly 12 strings. No explanation, no markdown, no backticks.',
  ].join('\n');
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === 'string' ? body.title : '';
  const optA = typeof body?.optA === 'string' ? body.optA : '';
  const optB = typeof body?.optB === 'string' ? body.optB : '';
  const context = typeof body?.context === 'string' ? body.context : '';

  if (!title || !optA || !optB) {
    return NextResponse.json({ error: 'Missing decision details' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
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
        max_tokens: 600,
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
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }
}
