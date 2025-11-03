
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const SoundwaveIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 10h1v4H3v-4Zm2 2h1v-4H5v4Zm2-3h1v6H7v-6Zm2 2h1v-4H9v4Zm2-5h1v10h-1V6Zm2-2h1v14h-1V4Zm2 3h1v8h-1V7Zm2-1h1v10h-1V6Zm2 3h1v4h-1v-4Z" />
  </svg>
);
