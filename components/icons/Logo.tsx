import React from 'react';

interface LogoProps {
  className?: string;
}

// Reverts to the original brand identity. This logo uses a professional indigo
// color scheme and an abstract soundwave icon, replacing the yellow robot mascot.
export const Logo: React.FC<LogoProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
    <circle cx="12" cy="12" r="12" fill="#4f46e5" /> {/* indigo-600 */}
    <path d="M7 18H9V6H7V18ZM11 22H13V2H11V22ZM3 14H5V10H3V14ZM15 18H17V6H15V18ZM19 14H21V10H19V14Z" fill="white"/>
  </svg>
);
