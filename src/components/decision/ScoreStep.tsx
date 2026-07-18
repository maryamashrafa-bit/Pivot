'use client';

import { useState } from 'react';
import type { ScoreMap } from '@/lib/types';

export function ScoreStep({
  side,
  optLabel,
  criteria,
  doneLabel,
  onSubmit,
}: {
  side: 'a' | 'b';
  optLabel: string;
  criteria: string[];
  doneLabel: string;
  onSubmit: (scores: ScoreMap) => void;
}) {
  const [scores, setScores] = useState<ScoreMap>(
    Object.fromEntries(criteria.map((c) => [c, 5]))
  );

  return (
    <div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: side === 'a' ? '50%' : '100%' }} />
      </div>
      <div className="blind-label">Scoring: &quot;{optLabel}&quot;</div>

      <div className="score-group">
        {criteria.map((c) => (
          <div className="scitem" key={c}>
            <div className="scitem-name">{c}</div>
            <div className="scitem-sub">How well does &quot;{optLabel}&quot; deliver on this?</div>
            <div className="stars">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <div
                  key={v}
                  className={'star ' + (v <= scores[c] ? 'on' : 'off')}
                  onClick={() => setScores((s) => ({ ...s, [c]: v }))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="done-chip" style={{ marginTop: 10 }} onClick={() => onSubmit(scores)}>
        {doneLabel}
      </button>
    </div>
  );
}
