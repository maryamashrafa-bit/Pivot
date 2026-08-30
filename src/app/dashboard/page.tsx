import Link from 'next/link';
import Logo from '@/components/Logo';
import DeleteDecisionButton from '@/components/DeleteDecisionButton';
import { PendingDecisionSync } from '@/components/decision/PendingDecisionSync';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/actions/auth';
import type { SavedDecision } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: decisions } = await supabase
    .from('decisions')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<SavedDecision[]>();

  return (
    <div className="page">
      <div className="topbar">
        <Logo href="/dashboard" />
        <div className="topbar-actions">
          <span className="topbar-email">{user?.email}</span>
          <Link href="/account" className="icon-btn">
            Account
          </Link>
          <form action={logout}>
            <button className="icon-btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <PendingDecisionSync />

      <div className="dash-title">Your decisions</div>
      <div className="dash-sub">Every decision you talk through with Pivot is saved here.</div>

      <Link href="/decision/new" className="new-decision-btn">
        + Start a new decision
      </Link>

      {decisions && decisions.length > 0 ? (
        <div className="decision-list">
          {decisions.map((d) => (
            <div className="decision-card" key={d.id}>
              <div className="decision-card-top">
                <Link href={`/decision/${d.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <div className="decision-card-title">{d.title}</div>
                </Link>
                <div className="decision-card-date">{formatDate(d.created_at)}</div>
                <DeleteDecisionButton id={d.id} />
              </div>
              <Link href={`/decision/${d.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="decision-card-sub">
                  {d.option_a} vs {d.option_b}
                </div>
                <div className="decision-card-winner">Leaning: {d.winner}</div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          You haven&apos;t talked through a decision yet. Start one above — Pivot
          will walk you through it, one question at a time.
        </div>
      )}
    </div>
  );
}
