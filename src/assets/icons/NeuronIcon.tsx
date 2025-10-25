// React import not required with JSX transform

export default function NeuronIcon({ className }: { className?: string }) {
  return (
    <svg id="mlcd-activation-neuron" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

