import Link from 'next/link';
import Logo from '@/components/Logo';
import DecisionChat from '@/components/decision/DecisionChat';

export default function NewDecisionPage() {
  return (
    <div className="app">
      <Logo href="/dashboard" />
      <Link href="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>
      <DecisionChat />
    </div>
  );
}
