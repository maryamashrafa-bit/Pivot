import Link from 'next/link';
import Logo from '@/components/Logo';
import SiteFooter from '@/components/SiteFooter';
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
        <p className="ai-disclaimer" style={{ marginTop: '-1rem', marginBottom: '1.75rem', borderTop: 'none', paddingTop: 0 }}>
          Pivot is an AI-assisted decision coaching tool. Like all AI tools it can make mistakes
          and should not replace professional advice for medical, legal or financial decisions.
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
            <span>Explore the full decision flow freely. Create a free account before you finish to save your results.</span>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
