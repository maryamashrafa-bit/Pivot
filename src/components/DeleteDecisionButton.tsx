'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteDecision } from '@/app/actions/decisions';

export default function DeleteDecisionButton({
  id,
  redirectTo,
}: {
  id: string;
  redirectTo?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  if (!confirming) {
    return (
      <button className="icon-btn danger" onClick={() => setConfirming(true)} type="button">
        Delete
      </button>
    );
  }

  return (
    <button
      className="icon-btn danger"
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await deleteDecision(id);
          if (redirectTo) router.push(redirectTo);
        });
      }}
    >
      {pending ? 'Deleting…' : 'Confirm delete'}
    </button>
  );
}
