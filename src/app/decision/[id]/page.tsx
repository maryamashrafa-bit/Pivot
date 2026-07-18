import Link from 'next/link';
import { notFound } from 'next/navigation';
import Logo from '@/components/Logo';
import DeleteDecisionButton from '@/components/DeleteDecisionButton';
import { ResultsView } from '@/components/decision/ResultsView';
import { createClient } from '@/lib/supabase/server';
import type { SavedDecision } from '@/lib/types';

export default async function DecisionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: decision } = await supabase
    .from('decisions')
    .select('*')
    .eq('id', id)
    .maybeSingle<SavedDecision>();

  if (!decision) notFound();

  const createdAt = new Date(decision.created_at).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="app">
      <Logo href="/dashboard" />
      <Link href="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>

      <div className="bubble-wrap">
        <div className="bubble pivot-bubble">
          <div className="binner">
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{decision.title}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
              {decision.option_a} vs {decision.option_b}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
              Talked through on {createdAt}
            </div>
            {decision.context && (
              <div
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '10px 13px',
                  marginBottom: 12,
                  lineHeight: 1.6,
                }}
              >
                {decision.context}
              </div>
            )}
            <ResultsView
              optA={decision.option_a}
              optB={decision.option_b}
              crit={decision.criteria}
              wts={decision.weights}
              scA={decision.scores_a}
              scB={decision.scores_b}
            />
          </div>
        </div>
      </div>

      <div className="send-row" style={{ marginTop: 20 }}>
        <Link href="/decision/new" className="btn-primary">
          Start a new decision
        </Link>
        <DeleteDecisionButton id={decision.id} redirectTo="/dashboard" />
      </div>
    </div>
  );
}
