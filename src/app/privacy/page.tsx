import Link from 'next/link';
import Logo from '@/components/Logo';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pivotdecisions@gmail.com';
const LAST_UPDATED = 'August 2026';

export default function PrivacyPage() {
  return (
    <div className="app">
      <Logo href="/" />
      <Link href="/" className="back-link">
        ← Back to home
      </Link>

      <div className="policy">
        <h1>Privacy Policy</h1>
        <div className="policy-updated">Last updated: {LAST_UPDATED}</div>

        <p>
          Pivot is a decision-coaching tool, and the situations people bring to it are often
          personal. This page explains, in plain language, what we collect, why, and what control
          you have over it — for both guests and people with an account.
        </p>

        <h2>What we collect</h2>
        <p>
          <strong>If you use Pivot as a guest (no account):</strong> your decision — its title,
          your two options, the personal context you share, and your scores — stays in your
          browser for that session only. It is sent to our AI provider to generate suggestions
          (see &quot;AI processing&quot; below), but it is never written to our database unless
          you create an account and it gets saved. We also collect basic, anonymous usage data
          (like which pages are visited) to understand how Pivot is used — this can&apos;t be
          tied back to you personally.
        </p>
        <p>
          <strong>If you create an account:</strong> we store your email address, and any
          decisions you choose to save — including the title, options, the personal context you
          shared, your importance ratings, and your scores for each option.
        </p>

        <h2>Why we collect it</h2>
        <p>
          Solely to provide the decision-coaching service: to generate suggestions tailored to
          your situation, to calculate your results, and — for account holders — to let you save
          a decision and come back to it later.
        </p>

        <h2>AI processing</h2>
        <p>
          When Pivot suggests factors to consider, your decision title, options, and personal
          context are sent to our AI provider (Anthropic) to generate that response. This
          happens for guests and account holders alike. It is not stored by Pivot as part of that
          request, and under Anthropic&apos;s API terms it is not used to train their models. The
          personal context you share is never used by us to train any AI model.
        </p>

        <h2>How long we keep it</h2>
        <p>
          A guest decision exists only in your browser and is never stored on our servers. A
          saved decision is kept until you delete it, or delete your account — at which point it
          and everything tied to it is permanently removed.
        </p>

        <h2>Who has access</h2>
        <p>
          Only you. We never share, sell, or use your personal data for advertising or any
          purpose beyond providing Pivot to you. Row-level security on our database means even we
          can&apos;t browse other users&apos; decisions through the app.
        </p>

        <h2>Where it&apos;s stored</h2>
        <p>
          Account and decision data is stored with Supabase on EU servers (Frankfurt), in line
          with GDPR.
        </p>

        <h2>Your rights</h2>
        <ul>
          <li>
            <strong>Access</strong> — you can see everything saved to your account from your
            dashboard at any time.
          </li>
          <li>
            <strong>Correction</strong> — you can edit or delete individual saved decisions
            whenever you like.
          </li>
          <li>
            <strong>Deletion</strong> — you can permanently delete your account and everything
            tied to it from your account settings, at any time.
          </li>
          <li>
            <strong>Withdraw consent</strong> — deleting your account withdraws consent for any
            further processing of your data.
          </li>
        </ul>

        <h2>Guest users</h2>
        <p>
          If you use Pivot without an account, nothing personal is stored on our servers, so
          there is nothing for us to delete on your behalf — closing your browser tab is enough.
        </p>

        <h2>Cookies</h2>
        <p>
          Pivot uses only the minimum needed to work: a session cookie to keep you signed in if
          you have an account, and (if you accept them) a minimal, anonymous analytics cookie to
          understand overall usage. Declining analytics cookies doesn&apos;t limit anything about
          using Pivot.
        </p>

        <h2>A note on crisis support</h2>
        <p>
          Pivot shows crisis support resources when a decision may indicate someone is in
          distress. We do not log, store, or review the content that triggers this — it is
          handled entirely by your device in the moment, and no record of it is kept.
        </p>

        <h2>Age</h2>
        <p>Pivot is intended for people aged 16 and over.</p>

        <h2>Questions or concerns</h2>
        <p>
          If you have any questions about your data, or want help with anything on this page,
          email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  );
}
