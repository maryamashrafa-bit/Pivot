'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface DeleteAccountState {
  error?: string;
}

// useActionState calls its action with (prevState, formData) positionally;
// neither is needed here, but the signature must accept both.
export async function deleteAccount(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: DeleteAccountState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<DeleteAccountState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Runs supabase/schema.sql's delete_own_account() — a SECURITY DEFINER
  // function scoped to auth.uid(), since deleting a user's own auth
  // record isn't reachable with just the anon key.
  const { error } = await supabase.rpc('delete_own_account');

  if (error) {
    return {
      error: 'Could not delete your account. Please try again, or contact us if this keeps happening.',
    };
  }

  await supabase.auth.signOut();
  redirect('/');
}
