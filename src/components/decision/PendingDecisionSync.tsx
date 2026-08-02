'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveDecision } from '@/app/actions/decisions';
import { takePendingDecision } from '@/lib/pending-decision';

// Runs on the dashboard (always behind auth) so that a decision finished
// as a guest gets saved for real the moment someone signs up or logs in.
export function PendingDecisionSync() {
  const [saving, setSaving] = useState(false);
  const started = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const pending = takePendingDecision();
    if (!pending) return;

    // Deliberately synchronous: localStorage only exists client-side, so
    // this must stay in the effect to avoid an SSR/hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaving(true);
    (async () => {
      try {
        const id = await saveDecision(pending);
        router.push(`/decision/${id}`);
      } catch {
        setSaving(false);
      }
    })();
  }, [router]);

  if (!saving) return null;

  return (
    <div className="auth-notice" style={{ marginBottom: '1.5rem' }}>
      Saving the decision you just finished…
    </div>
  );
}
