import React from 'react';

export default function SigmoidIcon({ className }: { className?: string }) {
  return (
    <svg id="mlcd-activation-sigmoid" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      {/* logistic-like curve */}
      <path d="M6 15c0-4 3-6 6-6 2 0 4 1 6 3" />
    </svg>
  );
}
