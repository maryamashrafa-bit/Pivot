'use client';

import { useState } from 'react';

const SOFT_TARGET = 6;
const MIN_TO_CONTINUE = 5;

export function ChipsStep({
  suggestions,
  onSubmit,
}: {
  suggestions: string[];
  onSubmit: (selected: string[]) => void;
}) {
  const [allChips, setAllChips] = useState(suggestions);
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState('');

  function toggle(val: string) {
    setSelected((s) => (s.includes(val) ? s.filter((x) => x !== val) : [...s, val]));
  }

  function addCustom() {
    const v = custom.trim();
    if (!v) return;
    setCustom('');
    if (!allChips.includes(v)) setAllChips((c) => [...c, v]);
    setSelected((s) => (s.includes(v) ? s : [...s, v]));
  }

  const count = selected.length;
  const ready = count >= SOFT_TARGET;
  const canContinue = count >= MIN_TO_CONTINUE;

  return (
    <div>
      <div className="chips-intro">
        Select at least 6 factors that resonate with you — the more you choose, the clearer your
        picture will be. You can remove any that don&apos;t feel right and add your own.
      </div>

      <div className="chips">
        {allChips.map((s) => (
          <div
            key={s}
            className={'chip' + (selected.includes(s) ? ' sel' : '')}
            onClick={() => toggle(s)}
          >
            {s}
          </div>
        ))}
      </div>
      <input
        type="text"
        className="single-input"
        style={{ marginTop: 10 }}
        placeholder="Add your own and press Enter..."
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addCustom();
          }
        }}
      />

      <div className={'chips-counter' + (ready ? ' ready' : '')}>
        {ready
          ? `${count} selected ✅`
          : `${count} selected — try to pick at least ${SOFT_TARGET}`}
      </div>

      <button className="done-chip" onClick={() => onSubmit(selected)} disabled={!canContinue}>
        Done — these are my factors
      </button>
    </div>
  );
}
