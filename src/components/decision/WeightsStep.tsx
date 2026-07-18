'use client';

import { useState } from 'react';
import type { WeightMap } from '@/lib/types';

function importanceLabel(v: number) {
  if (v >= 9) return 'Essential';
  if (v >= 7) return 'Very important';
  if (v >= 5) return 'Important';
  if (v >= 3) return 'Slightly important';
  return 'Not important';
}

export function WeightsStep({
  criteria,
  onSubmit,
}: {
  criteria: string[];
  onSubmit: (weights: WeightMap) => void;
}) {
  const [weights, setWeights] = useState<WeightMap>(
    Object.fromEntries(criteria.map((c) => [c, 5]))
  );

  return (
    <div>
      <div className="slider-group">
        {criteria.map((c) => (
          <div className="sitem" key={c}>
            <div className="sitem-name">{c}</div>
            <div className="sitem-row">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={weights[c]}
                onChange={(e) =>
                  setWeights((w) => ({ ...w, [c]: parseInt(e.target.value, 10) }))
                }
              />
              <div className="sitem-val">{importanceLabel(weights[c])}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="done-chip" style={{ marginTop: 10 }} onClick={() => onSubmit(weights)}>
        That feels right
      </button>
    </div>
  );
}
