import Link from 'next/link';
import Logo from '@/components/Logo';
import DecisionChat from '@/components/decision/DecisionChat';
import { createClient } from '@/lib/supabase/server';

export default async function NewDecisionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="app">
      <Logo href={isAuthenticated ? '/dashboard' : '/'} />
      <Link href={isAuthenticated ? '/dashboard' : '/'} className="back-link">
        ← {isAuthenticated ? 'Back to dashboard' : 'Back to home'}
      </Link>
      <DecisionChat isAuthenticated={isAuthenticated} />
    </div>
  );
}
