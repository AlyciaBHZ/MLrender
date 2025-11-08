import React from 'react';

type Props = {
  title?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'>;

const base = 'text-xs px-2 py-1 rounded border hover:bg-gray-50';

const IconButton = React.forwardRef<HTMLButtonElement, Props>(function IconButton(
  { title, ariaLabel, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={className ? `${base} ${className}` : base}
      title={title}
      aria-label={ariaLabel || title}
      {...rest}
    >
      {children}
    </button>
  );
});

export default IconButton;
