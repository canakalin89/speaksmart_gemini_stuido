import React from 'react';

interface LogoProps {
  className?: string;
}

// This component now renders the uploaded logo.png file.
export const Logo: React.FC<LogoProps> = ({ className }) => (
  <img src="https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/dosyalar/2025_11/03215750_speaksmartaltlogo.png" alt="SpeakSmart Logo" className={`${className} rounded-full object-cover`} />
);