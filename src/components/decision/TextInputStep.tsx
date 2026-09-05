'use client';

import { useState } from 'react';

export function TextInputStep({
  placeholder,
  onSubmit,
}: {
  placeholder: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState('');

  function go() {
    const v = value.trim();
    if (v) onSubmit(v);
  }

  return (
    <div className="send-row">
      <input
        type="text"
        className="single-input"
        placeholder={placeholder}
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) go();
        }}
      />
      <button className="send-btn" disabled={!value.trim()} onClick={go}>
        Continue
      </button>
    </div>
  );
}

export function ContextInputStep({
  onSubmit,
  placeholder,
}: {
  onSubmit: (value: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');

  return (
    <>
      <div className="send-row">
        <textarea
          className="single-input"
          autoFocus
          placeholder={
            placeholder ??
            "e.g. I've been in my role for 10 years, I have young children, I run a side business, and I'm worried about losing work-life balance..."
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="context-privacy">
        🔒 This is completely private. Only you can see what you share here. Your context is
        never stored beyond your session if using as a guest.
      </div>
      <div className="send-row" style={{ marginTop: 6 }}>
        <button className="skip-btn" onClick={() => onSubmit('')}>
          Skip this step
        </button>
        <button className="send-btn" disabled={!value.trim()} onClick={() => onSubmit(value.trim())}>
          Continue
        </button>
      </div>
    </>
  );
}
