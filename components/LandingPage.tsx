import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from './icons/Logo';

interface LandingPageProps {
  onStart: () => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-slate-100/50 rounded-xl backdrop-blur-sm">
    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-amber-100 text-amber-600 rounded-full">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full relative py-8 sm:py-12">
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-center bg-cover opacity-[.03] pointer-events-none"
        style={{
          backgroundImage: `url('https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/dosyalar/2025_11/04124710_u6212943116_a_cute_yellow_robot_budgie_its_a_companion_for_spee_b5c4e5578950426293f6a2c54e0610b3.png')`,
          maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
        }}
        aria-hidden="true"
      ></div>
      
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto text-center py-12 sm:py-20 px-4">
          <Logo className="w-24 h-24 mx-auto mb-6 shadow-lg rounded-full" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t('landing-title')}
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-8">
            {t('landing-subtitle')}
          </p>
          <button
            onClick={onStart}
            className="bg-amber-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-amber-600 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 shadow-lg text-lg"
          >
            {t('landing-cta')}
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="psychology"
              title={t('feature1-title')}
              description={t('feature1-desc')}
            />
            <FeatureCard
              icon="bolt"
              title={t('feature2-title')}
              description={t('feature2-desc')}
            />
            <FeatureCard
              icon="menu_book"
              title={t('feature3-title')}
              description={t('feature3-desc')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;