import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Handles the link a user clicks from their confirmation email and lands
// them back in the app instead of Supabase's default (blank) redirect.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? '/dashboard';
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // No usable code/token_hash in the query string — Supabase may instead
  // have put the session in the URL's hash fragment, which this server
  // handler can never see (fragments aren't sent over HTTP). Hand off to a
  // client page that can actually read it before giving up.
  return NextResponse.redirect(
    `${origin}/auth/confirm/finish?next=${encodeURIComponent(next)}`
  );
}
