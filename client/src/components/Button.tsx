import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'dark' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asChild?: boolean;
  href?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  href,
  onClick,
}) => {
  const Base = (asChild || href ? 'a' : 'button') as any;

  const baseClasses = 'inline-flex items-center justify-center font-sans font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: `
      bg-signal-blue text-paper shadow-sm-3 hover:bg-[#0056cc] hover:shadow-sm-2 text-paper
      ${baseClasses}
    `,
    dark: `
      bg-ink-navy text-paper hover:bg-[#082640]
      ${baseClasses}
    `,
    secondary: `
      bg-ink-navy text-paper hover:bg-[#082640]
      ${baseClasses}
    `,
    outline: `
      border border-hairline text-ink-navy hover:border-signal-blue hover:bg-pebble
      ${baseClasses}
    `,
    ghost: `
      text-ink-navy hover:text-signal-blue bg-transparent
      ${baseClasses}
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[14px]',
    md: 'px-4 py-2 text-[16px]',
    lg: 'px-5 py-2.5 text-[18px]',
  };

  const radius = 'rounded-[8px]';

  return (
    <Base
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${radius} ${className}`}
      {...(asChild || href ? { href } : { onClick })}
    >
      {children}
    </Base>
  );
};

export default Button;
