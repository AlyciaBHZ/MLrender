// 图标组件集合（无需显式引入 React）

export const InputDataIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#374151" strokeWidth="2" />
    <path d="M6 9h12M6 12h12M6 15h7" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ConvIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="12" height="12" rx="2" stroke="#f59e0b" strokeWidth="2" />
    <rect x="8" y="4" width="12" height="12" rx="2" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />
  </svg>
);

export const PoolIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="#10b981" strokeWidth="2" />
    <path d="M7 12h10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 9v6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const RNNIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="#a855f7" strokeWidth="2" />
    <path d="M9 9h6M9 12h6" stroke="#a855f7" strokeWidth="2" />
    <path d="M15 15c2 0 3-1 3-3s-1-3-3-3" stroke="#a855f7" strokeWidth="2" fill="none" />
  </svg>
);

export const OutputIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="7" stroke="#ef4444" strokeWidth="2" />
    <path d="M9 12h6" stroke="#ef4444" strokeWidth="2" />
  </svg>
);

export const LossIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="3" stroke="#ef4444" strokeWidth="2" fill="#fee2e2" />
  </svg>
);

export const OptimIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="7" stroke="#0ea5e9" strokeWidth="2" />
    <path d="M12 8v3l2 2" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ConnectorArrowIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12h12" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 8l6 4-6 4V8z" fill="#374151" />
  </svg>
);

export const ResidualIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12h10" stroke="#111827" strokeWidth="2" strokeDasharray="6 4" />
    <circle cx="14" cy="12" r="3" fill="#111827" />
    <path d="M17 12h3" stroke="#111827" strokeWidth="2" strokeDasharray="6 4" />
  </svg>
);

export const ActivationIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="7" stroke="#22c55e" strokeWidth="2" fill="#ecfdf5" />
  </svg>
);

export const BatchNormIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="#3b82f6" strokeWidth="2" />
    <path d="M7 15h10M7 12h6M7 9h3" stroke="#3b82f6" strokeWidth="2" />
  </svg>
);

export const DropoutIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
    <circle cx="9" cy="12" r="1" fill="#06b6d4" />
    <circle cx="12" cy="12" r="1" fill="#06b6d4" />
    <circle cx="15" cy="12" r="1" fill="#06b6d4" />
  </svg>
);

export const FlattenIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="6" width="6" height="12" rx="1" stroke="#f43f5e" />
    <rect x="13" y="6" width="6" height="12" rx="1" stroke="#f43f5e" />
    <path d="M11 12h2" stroke="#f43f5e" strokeWidth="2" />
  </svg>
);

export const EmbeddingIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="#10b981" strokeWidth="2" />
    <path d="M8 10h8M8 14h5" stroke="#10b981" strokeWidth="2" />
  </svg>
);

export const AttentionIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="6" stroke="#a78bfa" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="#a78bfa" />
    <path d="M4 12h4M16 12h4" stroke="#a78bfa" strokeWidth="2" />
  </svg>
);

export const SoftmaxIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 16c2-6 4-6 6 0s4 6 6 0" stroke="#fb923c" strokeWidth="2" fill="none" />
  </svg>
);

export const TensorIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="7" width="10" height="10" rx="2" stroke="#3b82f6" strokeWidth="2" />
    <rect x="9" y="5" width="10" height="10" rx="2" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
    <path d="M5 9l4-2m0 10 4-2m2-10 4 2m0 10-4 2" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
  </svg>
);
