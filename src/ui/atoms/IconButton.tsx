import React from 'react';

type Props = {
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
};

const base = 'text-xs px-2 py-1 rounded border hover:bg-gray-50';

export default function IconButton({ title, onClick, className, children, ariaLabel }: Props) {
  return (
    <button
      type="button"
      className={className ? `${base} ${className}` : base}
      title={title}
      aria-label={ariaLabel || title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

