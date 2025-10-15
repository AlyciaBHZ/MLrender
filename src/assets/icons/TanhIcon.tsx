import React from 'react';

export default function TanhIcon({ className }: { className?: string }) {
  return (
    <svg id="mlcd-activation-tanh" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      {/* tanh-like waveform (saturating) */}
      <path d="M5 12c0-4 3-6 7-6 3 0 5 2 5 4 0 2-2 4-5 4-4 0-7-2-7-6" />
    </svg>
  );
}
