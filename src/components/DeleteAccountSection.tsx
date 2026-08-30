'use client';

import { useActionState, useState } from 'react';
import { deleteAccount, type DeleteAccountState } from '@/app/actions/account';

const initialState: DeleteAccountState = {};

export default function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteAccount, initialState);

  if (!confirming) {
    return (
      <button className="icon-btn danger" onClick={() => setConfirming(true)} type="button">
        Delete my account and all data
      </button>
    );
  }

  return (
    <div>
      <div className="auth-error">
        This will permanently delete your account and all your decisions. This cannot be undone.
      </div>
      {state?.error && <div className="auth-error">{state.error}</div>}
      <div className="send-row" style={{ marginTop: 10 }}>
        <button className="skip-btn" onClick={() => setConfirming(false)} type="button" disabled={pending}>
          Cancel
        </button>
        <form action={formAction}>
          <button className="icon-btn danger" type="submit" disabled={pending}>
            {pending ? 'Deleting…' : 'Yes, delete everything'}
          </button>
        </form>
      </div>
    </div>
  );
}
