import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'white' | 'product' | 'panel' | 'tinted' | 'accent';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'product',
  className = '',
}) => {
  const variantClasses = {
    white: 'bg-paper rounded-[16px] border border-hairline p-6 shadow-sm-2 hover:shadow-sm-2 transition-all duration-200',
    product: 'bg-paper rounded-[16px] border border-hairline p-6 shadow-sm-2 hover:shadow-sm-2 transition-all duration-200',
    panel: 'bg-paper rounded-[24px] border border-hairline p-6 shadow-sm hover:shadow-sm-2 transition-all duration-200',
    tinted: 'bg-pebble rounded-[16px] border border-hairline p-6 transition-all duration-200',
    accent: 'bg-paper rounded-[24px] border border-hairline p-6 shadow-sm-2 relative overflow-hidden',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
