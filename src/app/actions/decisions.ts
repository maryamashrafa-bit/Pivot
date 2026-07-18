'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ScoreMap, WeightMap } from '@/lib/types';

interface SaveDecisionInput {
  title: string;
  optA: string;
  optB: string;
  context: string;
  crit: string[];
  wts: WeightMap;
  scA: ScoreMap;
  scB: ScoreMap;
  scoreA: number;
  scoreB: number;
  winner: string;
}

export async function saveDecision(input: SaveDecisionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to save a decision.');
  }

  const { data, error } = await supabase
    .from('decisions')
    .insert({
      user_id: user.id,
      title: input.title,
      option_a: input.optA,
      option_b: input.optB,
      context: input.context,
      criteria: input.crit,
      weights: input.wts,
      scores_a: input.scA,
      scores_b: input.scB,
      score_a: input.scoreA,
      score_b: input.scoreB,
      winner: input.winner,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error('Could not save this decision. Please try again.');
  }

  revalidatePath('/dashboard');
  return data.id as string;
}

export async function deleteDecision(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to delete a decision.');
  }

  const { error } = await supabase.from('decisions').delete().eq('id', id);

  if (error) {
    throw new Error('Could not delete this decision.');
  }

  revalidatePath('/dashboard');
}
