
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const HistoryIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.56 12.28a.75.75 0 0 0 1.06-1.06l-4.25-4.25a.75.75 0 0 0-1.06 0l-4.25 4.25a.75.75 0 1 0 1.06 1.06L8 10.81V16.5a.75.75 0 0 0 1.5 0v-5.69l2.06 2.06Z" clipRule="evenodd" transform="rotate(90 12 12)"/>
        <path d="M12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"/>
    </svg>
);
