import type { ScoreMap, WeightMap } from '@/lib/types';

export function SummaryStep({
  optA,
  optB,
  crit,
  wts,
  scA,
  scB,
  onBack,
  onContinue,
}: {
  optA: string;
  optB: string;
  crit: string[];
  wts: WeightMap;
  scA: ScoreMap;
  scB: ScoreMap;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <div className="summary-wrap">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Importance</th>
              <th>{optA}</th>
              <th>{optB}</th>
              <th>Leaning</th>
            </tr>
          </thead>
          <tbody>
            {crit.map((c) => {
              const a = scA[c] ?? 5;
              const b = scB[c] ?? 5;
              const leaning = a === b ? 'tie' : a > b ? 'a' : 'b';
              return (
                <tr key={c}>
                  <td className="summary-factor">{c}</td>
                  <td>{wts[c] ?? 5}/10</td>
                  <td>{a}/10</td>
                  <td>{b}/10</td>
                  <td>
                    <span className="summary-indicator">
                      <span
                        className={
                          'summary-dot ' +
                          (leaning === 'a' ? 'sd-a' : leaning === 'b' ? 'sd-b' : 'sd-tie')
                        }
                      />
                      {leaning === 'tie' ? 'Tied' : leaning === 'a' ? optA : optB}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="send-row" style={{ marginTop: 14 }}>
        <button className="skip-btn" onClick={onBack} type="button">
          Go back and adjust
        </button>
        <button className="send-btn" onClick={onContinue} type="button">
          Show my results
        </button>
      </div>
    </div>
  );
}
