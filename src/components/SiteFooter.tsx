import Link from 'next/link';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'privacy@pivot-app.example';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Use</Link>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
      <div>Pivot is an AI-assisted thinking tool — not a substitute for professional advice.</div>
      <div className="footer-crisis">Crisis resources: Samaritans 116 123 | SHOUT text 85258</div>
    </footer>
  );
}
