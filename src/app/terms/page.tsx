import Link from 'next/link';
import Logo from '@/components/Logo';

const LAST_UPDATED = 'August 2026';

export default function TermsPage() {
  return (
    <div className="app">
      <Logo href="/" />
      <Link href="/" className="back-link">
        ← Back to home
      </Link>

      <div className="policy">
        <h1>Terms of Use</h1>
        <div className="policy-updated">Last updated: {LAST_UPDATED}</div>

        <p>These terms are written in plain language on purpose. By using Pivot, you agree to them.</p>

        <h2>Who Pivot is for</h2>
        <p>
          Pivot is intended for people aged 16 and over. By using Pivot you&apos;re confirming
          you meet that minimum age.
        </p>

        <h2>What Pivot is for</h2>
        <p>
          Pivot is designed for genuine life decisions — things like career choices,
          relationships, family, and lifestyle. Please don&apos;t use it to generate sexually
          explicit, hateful, or discriminatory content, or for anything unrelated to making a
          real decision.
        </p>

        <h2>Pivot is a thinking tool, not a professional</h2>
        <p>
          Pivot is an AI-assisted decision-coaching tool. Like all AI tools, it can make
          mistakes, and its suggestions are a starting point for your own thinking, not a
          verdict. Pivot is not a substitute for professional medical, legal, or financial
          advice — please consult a qualified professional for those.
        </p>

        <h2>Safeguarding</h2>
        <p>
          If Pivot detects that a decision may involve a crisis, self-harm, or risk to yourself
          or others, it will stop the normal flow and show you support resources instead. If
          you&apos;re in crisis, please use these instead of Pivot:
        </p>
        <ul>
          <li>Samaritans — call 116 123, free, 24/7</li>
          <li>SHOUT — text SHOUT to 85258, free, 24/7</li>
          <li>Papyrus (under 35) — call 0800 068 4141, 9am–midnight</li>
          <li>Outside the UK — visit findahelpline.com for international support</li>
          <li>In immediate danger — call 999 (or your local emergency number)</li>
        </ul>

        <h2>Privacy</h2>
        <p>
          Your decisions are private. We never share or sell them. See our{' '}
          <Link href="/privacy">Privacy Policy</Link> for the full detail on what&apos;s
          collected and why.
        </p>

        <h2>Your account</h2>
        <p>
          You&apos;re responsible for keeping your login details secure. You can delete your
          account and all associated data at any time from your account settings.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms occasionally as Pivot evolves. The date at the top of this
          page always reflects the latest version.
        </p>
      </div>
    </div>
  );
}
