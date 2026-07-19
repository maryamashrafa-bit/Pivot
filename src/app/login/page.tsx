'use client';

import { Suspense, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { login, type AuthFormState } from '@/app/actions/auth';

const initialState: AuthFormState = {};

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const confirmationFailed = searchParams.get('error') === 'confirmation_failed';

  return (
    <>
      {state?.error && <div className="auth-error">{state.error}</div>}
      {!state?.error && confirmationFailed && (
        <div className="auth-error">
          That confirmation link didn&apos;t work — it may have expired. Try signing in, or sign
          up again.
        </div>
      )}

      <form action={formAction}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="auth-submit" type="submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="page">
      <Logo href="/" />
      <div className="auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to pick up where you left off.</div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <div className="auth-switch">
          New to Pivot? <Link href="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
