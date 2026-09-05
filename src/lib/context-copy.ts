import { detectCategory, type Category } from '@/lib/fallback-suggestions';

// How much a decision category typically warrants asking someone to open
// up about their life — a career/family/health/relationship/financial
// decision usually needs it, a move or course is somewhere in between,
// and an everyday decision (which falls through to "general" — nothing
// else matched) needs almost none of it.
export type ContextScale = 'big' | 'medium' | 'small';

const SCALE_BY_CATEGORY: Record<Category, ContextScale> = {
  career: 'big',
  family: 'big',
  relationship: 'big',
  financial: 'big',
  health: 'big',
  business: 'big',
  home: 'big',
  retirement: 'big',
  caregiving: 'big',
  relocation: 'medium',
  lifestyle: 'medium',
  education: 'medium',
  general: 'small',
};

const PROMPT_BY_SCALE: Record<ContextScale, string> = {
  big: 'The more context you share, the more tailored your suggestions will be. Tell us a little about your situation — things like family, work, finances, or what’s worrying you most. Even a sentence or two helps enormously.',
  medium: 'A little context goes a long way. What’s your situation right now — anything relevant to this decision that would help us tailor the suggestions for you?',
  small: 'Anything that might be relevant? For example how you’re feeling today, what else you have on, or any constraints worth knowing about. Or just skip this — it’s optional!',
};

const PLACEHOLDER_BY_SCALE: Record<ContextScale, string> = {
  big: "e.g. I've been in my role for 10 years, I have young children, I run a side business, and I'm worried about losing work-life balance...",
  medium: "e.g. We've been here a few years and it mostly works, but a couple of things have been nagging at me...",
  small: "e.g. Feeling a bit tired today, nothing else major on this evening...",
};

export function contextScale(title: string, optA: string, optB: string): ContextScale {
  const category = detectCategory(title, `${optA} ${optB}`);
  return SCALE_BY_CATEGORY[category];
}

export function contextPrompt(scale: ContextScale): string {
  return PROMPT_BY_SCALE[scale];
}

export function contextPlaceholder(scale: ContextScale): string {
  return PLACEHOLDER_BY_SCALE[scale];
}
