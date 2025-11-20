import React from 'react';

export type SvgIconName = 'success' | 'info' | 'warning' | 'error' | 'close';

interface SvgIconProps {
  name: SvgIconName;
  size?: number;
  className?: string;
}

const iconMap: Record<SvgIconName, React.ReactNode> = {
  success: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.5 12.5l2.5 2.5 4.5-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="9" r="1" fill="currentColor" />
      <path d="M12 12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  warning: (
    <>
      <path
        d="M12 4l8 14H4l8-14z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export const SvgIcon: React.FC<SvgIconProps> = ({ name, size = 20, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    role="presentation"
    aria-hidden="true"
  >
    {iconMap[name]}
  </svg>
);


