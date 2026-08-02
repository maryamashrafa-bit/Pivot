'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { saveDecision } from '@/app/actions/decisions';
import { storePendingDecision } from '@/lib/pending-decision';
import type { ScoreMap, WeightMap } from '@/lib/types';

interface Props {
  title: string;
  optA: string;
  optB: string;
  context: string;
  crit: string[];
  wts: WeightMap;
  scA: ScoreMap;
  scB: ScoreMap;
  scoreA: number;
  scoreB: number;
  winner: string;
  isAuthenticated: boolean;
  onRestart: () => void;
}

export function FinalActions(props: Props) {
  const { isAuthenticated } = props;
  const [status, setStatus] = useState<'saving' | 'saved' | 'error'>('saving');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const payload = {
      title: props.title,
      optA: props.optA,
      optB: props.optB,
      context: props.context,
      crit: props.crit,
      wts: props.wts,
      scA: props.scA,
      scB: props.scB,
      scoreA: props.scoreA,
      scoreB: props.scoreB,
      winner: props.winner,
    };

    if (!isAuthenticated) {
      // Keep this decision around locally so it can be saved for real the
      // moment they create an account — signing up should feel like it
      // rewards them with this result, not like starting over.
      storePendingDecision(payload);
      return;
    }

    (async () => {
      try {
        const id = await saveDecision(payload);
        setSavedId(id);
        setStatus('saved');
      } catch (e) {
        setStatus('error');
        setErrorMsg(e instanceof Error ? e.message : 'Could not save this decision.');
      }
    })();
    // Save exactly once on mount, regardless of later prop identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div>
      <div className="send-row">
        <button className="restart-btn" onClick={props.onRestart}>
          Start a new decision
        </button>
        {isAuthenticated && (
          <Link
            href="/dashboard"
            className="restart-btn"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Back to dashboard
          </Link>
        )}
      </div>

      {isAuthenticated && status === 'saving' && (
        <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8 }}>
          Saving to your account…
        </div>
      )}
      {isAuthenticated && status === 'saved' && savedId && (
        <div style={{ fontSize: 15, color: '#2D7D52', marginTop: 8 }}>
          Saved ✓ —{' '}
          <Link href={`/decision/${savedId}`} style={{ color: '#2D7D52', fontWeight: 500 }}>
            view it later
          </Link>
        </div>
      )}
      {isAuthenticated && status === 'error' && (
        <div style={{ fontSize: 15, color: '#a83232', marginTop: 8 }}>{errorMsg}</div>
      )}

      {!isAuthenticated && (
        <div className="signup-cta">
          <p>
            Want to save your results and come back to this decision? Create a free account.
          </p>
          <div className="send-row">
            <Link href="/signup" className="btn-primary">
              Create a free account
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
