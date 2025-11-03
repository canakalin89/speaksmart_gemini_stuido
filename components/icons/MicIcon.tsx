
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const MicIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM11 20.93V17.07a8 8 0 0 1-6-7.72A1 1 0 0 1 6 8.35a1 1 0 0 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 2 0 1 1 0 0 1-1 1.01a8 8 0 0 1-6 7.72v3.86a1 1 0 1 1-2 0Z"/>
  </svg>
);
