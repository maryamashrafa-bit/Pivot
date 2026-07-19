'use client';

import { useState } from 'react';

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
  const [warning, setWarning] = useState('');

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

  function done() {
    if (selected.length < 2) {
      setWarning('Please select at least 2 factors to continue.');
      return;
    }
    onSubmit(selected);
  }

  return (
    <div>
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
      {warning && (
        <div style={{ fontSize: 15, color: "#a83232", marginTop: 8 }}>{warning}</div>
      )}
      <button className="done-chip" onClick={done}>
        Done — these are my factors
      </button>
    </div>
  );
}
