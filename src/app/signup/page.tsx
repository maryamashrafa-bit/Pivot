'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { signup, type AuthFormState } from '@/app/actions/auth';

const initialState: AuthFormState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div className="page">
      <Logo href="/" />
      <div className="auth-card">
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">
          A calm place to think through decisions, and come back to them later.
        </div>

        {state?.error && <div className="auth-error">{state.error}</div>}
        {state?.notice && <div className="auth-notice">{state.notice}</div>}

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
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
          <button className="auth-submit" type="submit" disabled={pending}>
            {pending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="context-privacy" style={{ textAlign: 'center', marginTop: 14 }}>
          By signing up you agree to our <Link href="/privacy">Privacy Policy</Link> and{' '}
          <Link href="/terms">Terms of Use</Link>. Your decisions are private and never shared.
        </div>

        <div className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
