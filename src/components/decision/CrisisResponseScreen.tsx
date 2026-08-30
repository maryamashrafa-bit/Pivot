import Link from 'next/link';

export function CrisisResponseScreen() {
  return (
    <div className="ack-card crisis-card">
      <p className="ack-p">
        It sounds like you might be going through something really difficult right now. Pivot
        isn&apos;t the right tool for this — but support is available and you don&apos;t have to
        face this alone.
      </p>

      <ul className="ack-resources">
        <li>🌿 Samaritans — call 116 123, free, 24/7</li>
        <li>🌿 SHOUT — text SHOUT to 85258, free, 24/7</li>
        <li>🌿 Papyrus (under 35) — call 0800 068 4141, 9am–midnight</li>
        <li>🌿 If you&apos;re outside the UK — visit findahelpline.com for international support</li>
        <li>🌿 If you&apos;re in immediate danger please call 999</li>
      </ul>

      <p className="ack-p">We care about you. 💚</p>
      <p className="ack-p">When you&apos;re ready — Pivot will be here to help with life decisions.</p>

      <Link href="/" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
        Return to Pivot
      </Link>
    </div>
  );
}
