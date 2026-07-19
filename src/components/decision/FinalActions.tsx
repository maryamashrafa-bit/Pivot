'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { saveDecision } from '@/app/actions/decisions';
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
  onRestart: () => void;
}

export function FinalActions(props: Props) {
  const [status, setStatus] = useState<'saving' | 'saved' | 'error'>('saving');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const id = await saveDecision({
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
        });
        setSavedId(id);
        setStatus('saved');
      } catch (e) {
        setStatus('error');
        setErrorMsg(e instanceof Error ? e.message : 'Could not save this decision.');
      }
    })();
    // Save exactly once on mount, regardless of later prop identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="send-row">
        <button className="restart-btn" onClick={props.onRestart}>
          Start a new decision
        </button>
        <Link href="/dashboard" className="restart-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Back to dashboard
        </Link>
      </div>
      {status === 'saving' && (
        <div style={{ fontSize: 14, color: '#9ca3af', marginTop: 8 }}>Saving to your account…</div>
      )}
      {status === 'saved' && savedId && (
        <div style={{ fontSize: 14, color: '#2D7D52', marginTop: 8 }}>
          Saved ✓ —{' '}
          <Link href={`/decision/${savedId}`} style={{ color: '#2D7D52', fontWeight: 500 }}>
            view it later
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div style={{ fontSize: 14, color: '#a83232', marginTop: 8 }}>{errorMsg}</div>
      )}
    </div>
  );
}
