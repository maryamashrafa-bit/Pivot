'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { login, type AuthFormState } from '@/app/actions/auth';

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="page">
      <Logo href="/" />
      <div className="auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to pick up where you left off.</div>

        {state?.error && <div className="auth-error">{state.error}</div>}

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

        <div className="auth-switch">
          New to Pivot? <Link href="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
