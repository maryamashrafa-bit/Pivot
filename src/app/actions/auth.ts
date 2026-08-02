'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/site-url';

const credentialsSchema = z.object({
  email: z.string().trim().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export interface AuthFormState {
  error?: string;
  notice?: string;
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid details.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: 'That email and password combination didn’t work.' };
  }

  redirect('/dashboard');
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid details.' };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      notice:
        'Almost there — check your email for a confirmation link before signing in.',
    };
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
