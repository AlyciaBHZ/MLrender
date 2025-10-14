// 简单 FC Layer 图标（无需显式引入 React）

// 中文说明：简单的 FC Layer 图标（SVG），用于侧边栏展示
export default function FCLayerIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="6" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
      <path d="M8 10h8M8 13h8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
