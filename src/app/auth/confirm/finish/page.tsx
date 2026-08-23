'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

// Reached when the server-side /auth/confirm route couldn't find a `code`
// or `token_hash` in the query string — which happens whenever Supabase
// completes confirmation by putting the session directly in the URL's hash
// fragment (`#access_token=...`) instead. A hash fragment is never sent to
// the server, so only client-side JS can see it. The Supabase browser
// client picks it up automatically on load (detectSessionInUrl), so this
// page just waits briefly for that to produce a session, then continues on.
function FinishConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let settled = false;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (settled || !session) return;
      settled = true;
      router.replace(next);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (settled || !data.session) return;
      settled = true;
      router.replace(next);
    });

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      setFailed(true);
    }, 4000);

    return () => {
      subscription.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [next, router]);

  if (failed) {
    return (
      <div className="page">
        <Logo href="/" />
        <div className="auth-card">
          <div className="auth-title">That confirmation link didn&apos;t work</div>
          <div className="auth-error" style={{ marginTop: 12 }}>
            It may have expired, or already been used. Try signing in, or sign up again.
          </div>
          <div className="send-row" style={{ marginTop: 16 }}>
            <Link href="/login" className="btn-primary">
              Sign in
            </Link>
            <Link href="/signup" className="btn-secondary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Logo href="/" />
      <div className="auth-card">
        <div className="auth-title">Confirming your account…</div>
        <div className="auth-sub">This should only take a moment.</div>
      </div>
    </div>
  );
}

export default function FinishConfirmPage() {
  return (
    <Suspense fallback={null}>
      <FinishConfirmInner />
    </Suspense>
  );
}
