import Link from 'next/link';

export function PreStartAcknowledgement({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="ack-card">
      <div className="auth-title">Before we start</div>
      <p className="ack-p">
        Pivot works best when used for genuine life decisions — career choices, relationships,
        family, lifestyle and everything in between.
      </p>

      <div className="ack-notice">
        <div className="ack-sub">A few things to know</div>
        <ul className="ack-list">
          <li>✅ Pivot is designed for people aged 16 and over</li>
          <li>✅ Pivot is an AI-assisted thinking tool — not a replacement for professional advice</li>
          <li>
            ✅ If you&apos;re going through a crisis or having thoughts of harming yourself or
            others, please reach out for support instead:
          </li>
        </ul>
        <ul className="ack-resources">
          <li>🌿 Samaritans — call 116 123, free, 24/7</li>
          <li>🌿 SHOUT — text SHOUT to 85258, free, 24/7</li>
          <li>🌿 Papyrus (under 35) — call 0800 068 4141, 9am–midnight</li>
          <li>🌿 If outside the UK — visit findahelpline.com for international support</li>
          <li>🌿 Emergency — call 999</li>
        </ul>
      </div>

      <p className="ack-p ack-confirm">
        By continuing you confirm you&apos;re 16 or over and using Pivot for a genuine life
        decision.
      </p>

      <button className="btn-primary" style={{ width: '100%' }} onClick={onContinue} type="button">
        Let&apos;s start
      </button>

      <div className="ack-links">
        <Link href="/privacy">Privacy Policy</Link>
        <span aria-hidden="true"> · </span>
        <Link href="/terms">Terms of Use</Link>
      </div>
    </div>
  );
}
