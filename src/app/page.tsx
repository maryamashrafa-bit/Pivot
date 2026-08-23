import Link from 'next/link';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryHref = user ? '/dashboard' : '/decision/new';
  const primaryLabel = user ? 'Go to your decisions' : 'Start a decision';

  return (
    <div className="page">
      <Logo href="/" />

      <div className="hero">
        <h1>A calm thinking partner for the decisions that matter.</h1>
        <p>
          Pivot walks you through a hard choice one gentle question at a time —
          no spreadsheets, no pressure. Score your options honestly, and see
          what your own answers reveal.
        </p>
        <div className="hero-actions">
          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
          </Link>
          {!user && (
            <Link href="/login" className="btn-secondary">
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="feature-list">
        <div className="feature">
          <div className="feature-dot" />
          <div className="feature-text">
            <strong>One question at a time</strong>
            <span>No overwhelming forms — just a conversation, at your pace.</span>
          </div>
        </div>
        <div className="feature">
          <div className="feature-dot" />
          <div className="feature-text">
            <strong>Tailored to your situation</strong>
            <span>Suggestions reflect the context you actually share, not generic advice.</span>
          </div>
        </div>
        <div className="feature">
          <div className="feature-dot" />
          <div className="feature-text">
            <strong>Honest, blind scoring</strong>
            <span>Score each option separately so you aren&apos;t swayed by comparison.</span>
          </div>
        </div>
        <div className="feature">
          <div className="feature-dot" />
          <div className="feature-text">
            <strong>No account needed to start</strong>
            <span>Talk through the whole decision first — save it with a free account only if you want to.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
