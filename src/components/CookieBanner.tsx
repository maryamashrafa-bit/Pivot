'use client';

import { useEffect, useState } from 'react';

const KEY = 'pivot:cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(KEY);
      // Deliberately synchronous: localStorage only exists client-side, so
      // this must stay in the effect to avoid an SSR/hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!existing) setVisible(true);
    } catch {
      // localStorage unavailable — just don't show the banner rather than
      // risk it reappearing every load.
    }
  }, []);

  function choose(value: 'accepted' | 'declined') {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      // Nothing to do if storage isn't available.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <div className="cookie-banner" role="dialog" aria-label="Cookie preferences">
        <div className="cookie-banner-inner">
          <div className="cookie-banner-text">
            Pivot uses minimal analytics cookies to understand how the app is used. No personal
            data is tracked.
          </div>
          <div className="cookie-banner-actions">
            <button className="icon-btn" onClick={() => choose('declined')} type="button">
              Decline
            </button>
            <button className="send-btn" onClick={() => choose('accepted')} type="button">
              Accept
            </button>
          </div>
        </div>
      </div>
      {/*
        A real block-level spacer, not padding. Several pages use
        min-height:100vh with box-sizing:border-box, so padding added
        there gets absorbed inside that same 100vh box on short pages
        instead of extending past it — leaving buttons at the bottom of
        a short page sitting exactly behind this fixed banner. A sibling
        element in normal flow has no such ceiling: it unconditionally
        adds to the page's real scrollable height, which is what
        actually guarantees clearance.
      */}
      <div className="cookie-banner-spacer" aria-hidden="true" />
    </>
  );
}
