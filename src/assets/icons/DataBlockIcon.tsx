// 数据块图标（无需显式引入 React）

// 中文说明：数据块（倾斜矩形/梯形）图标，代表数据流
export default function DataBlockIcon({ className = 'w-5 h-5', direction = 'right' as 'left' | 'right' }: { className?: string; direction?: 'left' | 'right' }) {
  const fill = '#f3f4f6';
  const stroke = '#6b7280';
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {direction === 'right' ? (
        <>
          <polygon points="4,7 18,5 20,17 6,19" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M8 12h8" stroke={stroke} strokeWidth="2" />
        </>
      ) : (
        <>
          <polygon points="6,5 20,7 18,19 4,17" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M8 12h8" stroke={stroke} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
