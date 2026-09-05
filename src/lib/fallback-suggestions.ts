export type Category =
  | 'family'
  | 'relationship'
  | 'career'
  | 'business'
  | 'home'
  | 'relocation'
  | 'retirement'
  | 'caregiving'
  | 'lifestyle'
  | 'financial'
  | 'health'
  | 'education'
  | 'general';

// Deliberately weightier than a bare checklist label — these are the
// category staples used when the static fallback has no keyword hooks to
// draw on, so even the "generic" half of the list should still read as
// considered rather than throwaway.
const FALLBACK_BANKS: Record<Category, string[]> = {
  family: [
    'Financial sustainability of this change long term',
    'How this affects your relationship with your partner or co-parent',
    'Impact on the children you already have',
    'Whether you feel emotionally ready for this right now',
    'What your support network would realistically look like',
    'The physical demands and recovery this would involve',
    'Whether your home has the space this needs',
    'How much flexibility you would need at work',
    'The practical day-to-day logistics of making this work',
    'Your long-term vision for what your family looks like',
    'Childcare arrangements you would need to put in place',
    'How your daily routine would need to change',
  ],
  career: [
    'Income trajectory over the next few years, not just now',
    'Whether this still fits your sense of identity as a professional',
    'The boundaries and on-call demands that come with it',
    'Professional autonomy — how much control you have day to day',
    'The peer relationships and culture you would be leaving or joining',
    'Whether it still gives you a sense of purpose',
    'Commute and how it reshapes your week',
    'Job security if things changed at short notice',
    'Room for skill development and progression',
    'Outlook for the industry over the coming years',
    'Workload and stress level realistically, not on paper',
    'How well it aligns with where you want to be long term',
  ],
  relationship: [
    'Emotional compatibility once the novelty wears off',
    'Whether your long-term goals actually point the same direction',
    'How you communicate when things get difficult',
    'How your families or friends would react',
    'How entangled your finances would become',
    'Whether the living arrangement genuinely works for both of you',
    'What your history together tells you about trust',
    'How you resolve conflict when it happens',
    'Whether you would still have enough independence and space',
    'Whether the timing is right for both of you, not just one',
    'Who you can rely on if things get hard',
    'The vision you each have for the future together',
  ],
  business: [
    'Whether your savings runway is enough to cover the gap before income steadies',
    'The realistic market demand for what you would be offering',
    'How your own skills and experience actually match what the business needs',
    'The time commitment this would take from the rest of your life',
    'The impact on your family while you get things off the ground',
    'Whether your motivation would survive the harder, less glamorous months',
    'What support and mentorship you would actually have around you',
    'The regulatory and legal groundwork you would need to get right',
    'How your fixed costs hold up without a steady salary',
    'The security you would be walking away from, honestly weighed',
    'Whether this is the right window in your life to take the risk',
    'How you would know if it was time to stop and go back',
  ],
  home: [
    'Whether the mortgage stays comfortable if your circumstances changed',
    'How the location and commute would actually shape your week',
    'The school catchment area, if that matters for your family',
    'Whether the size suits not just now but where your family is headed',
    'The condition of the property and what renovation would really cost',
    'Whether the neighbourhood and community feel like somewhere you would stay',
    'Transport links for the day-to-day of living there',
    'Whether this is a sound investment, not just a nice place to live',
    'How close it keeps you to the family who matter to you',
    'What you would be giving up financially to make this stretch',
    'How settled you would feel putting real roots down here',
    'Whether this still works if only one income had to carry it',
  ],
  retirement: [
    'Whether your pension and savings genuinely support this timing',
    'Your health and energy levels now, not just on paper',
    'What would give you a sense of purpose once work stops',
    'How this changes day-to-day life with the people around you',
    'What you would actually do with the time you would be gaining',
    'Whether a phased or part-time step down suits you better than stopping outright',
    'What kind of legacy or contribution still matters to you',
    'The travel or lifestyle goals you have been waiting for',
    'Whether stepping back now costs you financially in the long run',
    'How ready you feel to let go of your professional identity',
    'Whether the timing fits your partner\'s plans as much as your own',
    'What you would miss most about work once it is gone',
  ],
  caregiving: [
    'Whether you have the physical and emotional capacity for this right now',
    'The financial implications of the care this would involve',
    'The impact on your own household while you take this on',
    'The quality of professional care available as an alternative',
    'How geographical distance affects what is realistically possible',
    'The relationship dynamics this would bring back into daily life',
    'Whether this is sustainable in the long run, not just right now',
    'What professional support could genuinely lighten the load',
    'How your own children would be affected by the change at home',
    'Whether the space and set-up at home can actually accommodate this',
    'What happens if things got harder than they are today',
    'Whether you are the right person to carry this, or if it should be shared',
  ],
  relocation: [
    'How the weather and climate there would actually suit you day to day',
    'The quality of local schools compared to what your children have now',
    'The real cost of living difference once housing and everyday costs are compared',
    'The local business and career climate if you ever needed to change jobs',
    'The tax environment and how it changes your actual take-home',
    'Safety and crime rates in the specific areas you would be living in',
    'The entertainment and social scene, and whether it fits the life you enjoy',
    'How far you would be from the family who matter to you',
    'Housing costs and what your money would actually buy there',
    'Commute and transport links for the day-to-day of your new life',
    'Access to healthcare and other services you currently rely on',
    'The community and sense of belonging you would be building from scratch',
  ],
  lifestyle: [
    'How your values actually line up with this change',
    'The social connections and community you would gain or lose',
    'Whether you would feel like you belong there',
    'How hard the practical adaptation would be day to day',
    'The real financial implications once everything is added up',
    'Whether this shifts your sense of who you are',
    'The difference in cost of living, properly worked out',
    'How your day-to-day routine would actually change',
    'Access to the things you currently rely on and value',
    'Whether this feels like adventure or instability to you',
    'How disruptive the transition itself would be',
    'Your honest read on long-term satisfaction with this change',
  ],
  financial: [
    'The immediate cost versus what you have available now',
    'The long-term risk if things don\'t go to plan',
    'How stable your income would be either way',
    'What you would be giving up by choosing this path',
    'The impact on any existing debt',
    'Your savings and emergency buffer afterwards',
    'Tax implications you might not have factored in',
    'The realistic return relative to the risk',
    'How much flexibility you would have if plans changed',
    'The knock-on effect on your retirement plans',
    'Day-to-day cash flow, not just the headline numbers',
    'Which option actually gives you peace of mind',
  ],
  health: [
    'The physical risk weighed against the realistic benefit',
    'How long recovery would genuinely take',
    'The impact on your quality of life day to day',
    'The cost of treatment and what it would strain',
    'Your long-term health outlook either way',
    'The effect on your day-to-day energy levels',
    'Side effects you would need to manage',
    'How easy follow-up care would be to access',
    'Anything in your family history worth weighing in',
    'The impact on your mental health specifically',
    'How much time this takes you away from normal life',
    'How much confidence you have in the medical advice you\'ve had',
  ],
  education: [
    'The cost and debt this would realistically involve',
    'Whether the career payoff justifies the investment',
    'The time commitment against everything else in your life',
    'How well this actually fits your interests, not just your CV',
    'Location and format constraints you\'d be working around',
    'The real-world reputation of the program',
    'Networking opportunities that would actually come from it',
    'The impact on your income while you study',
    'How this balances against your family life',
    'How relevant the skills would stay in the long run',
    'How flexible the schedule really is',
    'What support would be available to you while studying',
  ],
  // Nothing else matched, which in practice usually means this is a
  // small, everyday decision rather than a life-defining one — so unlike
  // every other bank, these stay deliberately light and low-stakes
  // (scale awareness applies to the fallback too, not just the live
  // prompt).
  general: [
    'How much energy you actually have for this right now',
    'Which one you would genuinely enjoy more',
    'How you will feel afterwards, not just in the moment',
    'What else you have got on today',
    'How much time this realistically takes',
    'Whether this fits your mood right now',
    'The effort involved versus how much you want it',
    'Whether you would regret skipping it',
    'How it affects the rest of your evening',
    'What you actually feel like doing, underneath the shoulds',
    'Whether this is the better choice for tomorrow-you',
    'How simple this really needs to be',
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
  relocation: [
    'move', 'moving', 'relocat', 'relocation', 'countryside', 'rural', 'village',
    'city', 'cities', 'town',
  ],
  lifestyle: ['travel', 'lifestyle', 'downsiz', 'minimalis'],
  business: [
    'business', 'self-employ', 'self employ', 'freelanc', 'startup', 'entrepreneur',
    'go independent', 'my own company',
  ],
  home: [
    'buy a house', 'buying a house', 'buy a home', 'buying a home', 'house purchase',
    'first-time buyer', 'school catchment', 'catchment area', 'homeowner', 'mortgage',
  ],
  retirement: ['retire', 'pension'],
  caregiving: [
    'elderly', 'care home', 'nursing home', 'caring for', 'ageing parent', 'aging parent',
    'had a fall', 'assisted living', 'live with us', 'living with us',
    'my mother', 'my father', 'my mum', 'my dad',
  ],
  career: [
    'job', 'career', 'work', 'promotion', 'salary', 'employer', 'resign',
    'quit', 'boss', 'coworker', 'nhs', 'gp', 'clinic', 'clinical', 'on-call', 'on call',
  ],
};

// Some keyword pairs are one word away from each other by design (e.g.
// "child"/"pregnan" as deliberate prefixes) — but that means a keyword
// like "child" is itself a substring of "children", so a context
// mentioning only "children" would match both and inflate the score for
// one concept. Collapse a match down to its longest matched form so each
// underlying word is only counted once.
function countKeywordHits(text: string, keywords: string[]): number {
  const hits = keywords.filter((w) => text.includes(w));
  const distinct = hits.filter(
    (w) => !hits.some((other) => other !== w && other.length > w.length && other.includes(w))
  );
  return distinct.length;
}

// The title is a deliberate statement of what the decision fundamentally
// is ("Should we have another child?"); the context is a free-flowing
// description that often mentions an adjacent worry in passing ("...and
// I worry about my career too"). Weighting the title more heavily stops
// an offhand context mention from hijacking the category away from what
// the person actually titled their decision.
const TITLE_WEIGHT = 3;

export function detectCategory(title: string, context: string): Category {
  const t = title.toLowerCase();
  const c = context.toLowerCase();
  let best: Category = 'general';
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = countKeywordHits(t, keywords) * TITLE_WEIGHT + countKeywordHits(c, keywords);
    if (score > bestScore) {
      bestScore = score;
      best = category as Category;
    }
  }
  return best;
}

// The static fallback (no API key, or the AI call failed) can't reason
// about the context like the prompt does, but it shouldn't be flatly
// generic either — keyword-triggered hooks let it nod to specifics the
// person actually mentioned, phrased as a full thought rather than a
// two-word label, so it still points at something concrete they wrote.
const CONTEXT_HOOKS: { test: RegExp; factor: string }[] = [
  { test: /toddler/i, factor: 'How your toddler specifically would experience this change' },
  { test: /newborn|infant/i, factor: 'Adjusting to a newborn again, on top of everything else' },
  { test: /\bbabies|\bbaby\b/i, factor: 'How this affects the baby you\'re considering' },
  { test: /\b3[- ]year[- ]old|\bthree[- ]year[- ]old/i, factor: 'How your 3-year-old would adjust to this' },
  { test: /\b6[- ]year[- ]old|\bsix[- ]year[- ]old/i, factor: 'How your 6-year-old would adjust to this' },
  { test: /school[- ]age/i, factor: 'The disruption to your school-age children\'s routine and friendships' },
  { test: /settled in (their|our) schools?/i, factor: 'Uprooting your children from schools they\'re settled in' },
  { test: /mortgage/i, factor: 'Your mortgage payments given the numbers you described' },
  { test: /\brent\b/i, factor: 'Your rent payments given the numbers you described' },
  { test: /finances? (is|are|feel|feels)? ?tight|tight finances|money is tight/i, factor: 'Whether your finances can genuinely absorb this right now' },
  { test: /\bdebt\b/i, factor: 'The debt you mentioned and how this affects it' },
  { test: /savings/i, factor: 'Your current savings cushion' },
  { test: /\bmortgage\b.*\bafford\b|\bafford\b.*\bhouse\b|\bhouse we can afford\b/i, factor: 'Whether the house you\'ve found is affordable once everything is factored in' },
  { test: /\bpartner\b|\bspouse\b|\bhusband\b|\bwife\b/i, factor: 'How this affects your partner specifically, given what you described' },
  { test: /works? long hours|works from home|work from home/i, factor: 'How your partner\'s work pattern changes what this looks like day to day' },
  { test: /\bmum\b|\bmom\b|\bdad\b|\bparents?\b/i, factor: 'The family support you mentioned, and whether it holds up' },
  { test: /\bpet\b|\bdog\b|\bcat\b/i, factor: 'Impact on your pet' },
  { test: /\bcommute\b/i, factor: 'The extra time the commute you described would actually cost you' },
  { test: /friends?/i, factor: 'Leaving behind the friends and community you described' },
  { test: /apartment|\bflat\b|\d\s?bedroom/i, factor: 'Whether your current space is really enough for this' },
  { test: /anxious|anxiety|worried|worry|scared|nervous|feels? scary/i, factor: 'The worry you described, named plainly rather than pushed aside' },
  { test: /excited|hopeful|looking forward/i, factor: 'The excitement you mentioned, weighed honestly against the risk' },
  { test: /on[- ]call/i, factor: 'Whether the on-call demands you described are sustainable long term' },
  { test: /\bnhs\b/i, factor: 'What leaving the NHS would mean for your professional identity' },
  { test: /performers list/i, factor: 'The impact on your performers list standing specifically' },
  { test: /\bvip\b/i, factor: 'The pressure of covering a VIP client or family specifically' },
  { test: /corporate/i, factor: 'Whether a corporate environment will suit you day to day' },
  { test: /identity/i, factor: 'The professional identity you described feeling tied to' },
  { test: /work[- ]life balance/i, factor: 'Whether this genuinely protects the work-life balance you value' },
  { test: /young family/i, factor: 'Sustainability alongside your young family specifically' },
  { test: /return(ed)? to work full time|full[- ]time after/i, factor: 'How full-time work affected you last time, and whether that would repeat' },
  { test: /mental health/i, factor: 'The mental health impact you\'re already anticipating' },
  { test: /cope practically|practically cope|coping practically/i, factor: 'Whether you could realistically cope practically day to day' },
  { test: /noise|pace of (the )?city/i, factor: 'Escaping the noise and pace you described' },
  { test: /convenience/i, factor: 'What you\'d be giving up in day-to-day convenience' },
  { test: /countryside|rural|village/i, factor: 'Whether rural life matches the reality, not just the appeal' },
  { test: /community/i, factor: 'The community you\'d be leaving behind' },
  { test: /\d+\s?(years?|yrs)\s+(experience|in my role|in the role)/i, factor: 'What walking away from your years of experience in this role would mean' },
  { test: /primary school/i, factor: 'Whether children already settled in primary school would adjust well to a new one' },
  { test: /\d+\s?%\s*(more|higher|pay|salary|increase)/i, factor: "Whether the pay increase is enough to offset everything else you'd be giving up" },
  { test: /works? remotely|remote work|location (doesn't|does not|won't) affect/i, factor: "Since your income isn't tied to location, what's actually pulling you towards the move" },
  { test: /own (our|your|my) home|homeowners?/i, factor: 'What selling or renting out the home you own would actually involve' },
  { test: /family nearby|near(by)? family|close to (my |our )?family/i, factor: 'Trading being near the family you described for whatever the move offers instead' },
  { test: /ready for a change/i, factor: 'Whether ‘ready for a change’ points to this move specifically or to change in general' },
  { test: /weather.*worr|worr.*weather|scottish weather/i, factor: 'Whether the weather worry is a small adjustment or a genuine dealbreaker' },
  { test: /\b4[- ]year[- ]old|\bfour[- ]year[- ]old/i, factor: 'How your 4-year-old would experience this change' },
  { test: /works? part[- ]time|part[- ]time job/i, factor: 'How relying more on one income while your partner works part-time would feel' },
  { test: /go(ing)? independent|self-employ|freelanc|start(ing)? (my|a|your) own (business|company)/i, factor: 'Whether going independent is worth trading steady income for' },
  { test: /\b\d+\s?(hours?|hrs)\s+away/i, factor: 'The realistic toll of being that far away if something urgent came up' },
  { test: /had a fall/i, factor: 'How serious the fall was, and whether it could happen again' },
  { test: /teenagers?/i, factor: 'How your teenagers would feel about the change at home' },
  { test: /reservations? about (the )?space/i, factor: "Your partner's reservations about space, named honestly rather than glossed over" },
];

function contextHooks(context: string, max = 7): string[] {
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
  const base = FALLBACK_BANKS[detectCategory(title, context)];
  const hooks = contextHooks(context);
  if (hooks.length === 0) return base;

  // A handful of category staples up front, then as many context-specific
  // hooks as matched (aiming at the same "most of these are specific"
  // bar the live prompt is held to), then fill out to 12 from the rest
  // of the category bank.
  const staples = base.slice(0, 5);
  const rest = base.slice(5);
  return [...staples, ...hooks, ...rest].slice(0, 12);
}
