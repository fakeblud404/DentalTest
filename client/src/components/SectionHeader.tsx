import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badgeLabel,
  className = '',
}) => {
  return (
    <div className={`${className} text-center mb-12 md:mb-16 max-w-[850px] mx-auto`}>
      {badgeLabel && (
        <span className="pill-badge mb-4 text-[12px] font-medium font-sans inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-blue inline-block"></span>
          {badgeLabel}
        </span>
      )}
      <h2 className="text-[38px] md:text-[50px] lg:text-[68px] font-bold font-sans text-ink-navy mb-4 leading-[1.2] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[16px] md:text-[18px] font-normal font-sans text-slate-gray max-w-[640px] mx-auto leading-[1.5]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
