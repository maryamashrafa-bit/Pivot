import Link from 'next/link';
import Logo from '@/components/Logo';
import DeleteAccountSection from '@/components/DeleteAccountSection';
import { createClient } from '@/lib/supabase/server';

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="app">
      <Logo href="/dashboard" />
      <Link href="/dashboard" className="back-link">
        ← Back to dashboard
      </Link>

      <div className="dash-title">Account settings</div>
      <div className="dash-sub">{user?.email}</div>

      <div className="settings-section danger-zone">
        <h2>Delete your account</h2>
        <p>
          Permanently deletes your email, all saved decisions, and all personal context you&apos;ve
          shared with Pivot. This cannot be undone.
        </p>
        <DeleteAccountSection />
      </div>
    </div>
  );
}
