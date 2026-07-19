import { computeResults } from '@/lib/scoring';
import type { ScoreMap, WeightMap } from '@/lib/types';

export function ResultsView({
  optA,
  optB,
  crit,
  wts,
  scA,
  scB,
}: {
  optA: string;
  optB: string;
  crit: string[];
  wts: WeightMap;
  scA: ScoreMap;
  scB: ScoreMap;
}) {
  const r = computeResults(optA, optB, crit, wts, scA, scB);
  const tw = crit.reduce((s, c) => s + (wts[c] ?? 5), 0) || 1;

  return (
    <div>
      <div
        style={{
          fontSize: 21,
          fontWeight: 600,
          color: r.diff < 0.3 ? '#111' : '#2D7D52',
        }}
      >
        {r.diff < 0.3 ? 'These two options are very evenly matched' : `"${r.winner}" leads the way`}
      </div>

      <div className="res-scores">
        <div className={'res-card' + (r.aWins ? ' win' : '')}>
          <div className="res-lbl">{optA}</div>
          <div className="res-num">{r.scoreA.toFixed(2)}</div>
          {r.aWins && <div className="win-tag">Leading</div>}
        </div>
        <div className={'res-card' + (!r.aWins ? ' win' : '')}>
          <div className="res-lbl">{optB}</div>
          <div className="res-num">{r.scoreB.toFixed(2)}</div>
          {!r.aWins && <div className="win-tag">Leading</div>}
        </div>
      </div>

      <div
        style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          fontWeight: 500,
          letterSpacing: '.4px',
          margin: '.75rem 0 .4rem',
          textTransform: 'uppercase',
        }}
      >
        What the scores reveal
      </div>

      {r.topWins.length > 0 && (
        <div className="insight ins-pos">
          &quot;{r.winner}&quot; scores higher on what matters most to you right now:{' '}
          {r.topWins.join(', ')}. That&apos;s the key reason it leads.
        </div>
      )}
      {r.topLose.length > 0 && (
        <div className="insight ins-warn">
          &quot;{r.loser}&quot; actually scores higher on: {r.topLose.join(', ')}. If that
          surprises you, it&apos;s worth sitting with.
        </div>
      )}
      {r.topTied.length > 0 && (
        <div className="insight ins-warn">
          Both options score equally on: {r.topTied.join(', ')}. These didn&apos;t tip the
          balance either way.
        </div>
      )}
      {r.biggest && Math.abs((scA[r.biggest] ?? 5) - (scB[r.biggest] ?? 5)) >= 3 && (
        <div className="insight ins-pos">
          The biggest gap between your options is on &quot;{r.biggest}&quot; — where &quot;
          {r.biggestGapHolder}&quot; scores significantly higher.
        </div>
      )}

      <div className="bleg">
        <div className="bli">
          <div className="bld" style={{ background: '#2D7D52' }} />
          {optA}
        </div>
        <div className="bli">
          <div className="bld" style={{ background: '#E8A838' }} />
          {optB}
        </div>
      </div>

      {r.sorted.map((c) => {
        const w = (wts[c] ?? 5) / tw;
        const wA = Math.round(((w * (scA[c] ?? 5)) / 10) * 100);
        const wB = Math.round(((w * (scB[c] ?? 5)) / 10) * 100);
        return (
          <div className="brow" key={c}>
            <div className="bname">{c}</div>
            <div className="bwrap">
              <div className="bar ba" style={{ width: `${wA}%` }} />
              <div className="bar bb" style={{ width: `${wB}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
