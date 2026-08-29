const STEP_LABELS = [
  'Your decision',
  'Your situation',
  'What matters',
  'Your priorities',
  'Score your options',
  'Your results',
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="step-indicator">
      <div className="step-dots">
        {STEP_LABELS.map((_, i) => {
          const n = i + 1;
          const cls = n === current ? 'step-dot current' : n < current ? 'step-dot done' : 'step-dot';
          return <div key={n} className={cls} />;
        })}
      </div>
      <div className="step-label">
        Step {current} of {STEP_LABELS.length} · {STEP_LABELS[current - 1]}
      </div>
    </div>
  );
}
