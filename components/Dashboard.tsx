import React from 'react';
import { useTranslation } from 'react-i18next';
import TopicSelector from './TopicSelector';
import RecentHistory from './RecentHistory';
import type { Evaluation } from '../types';

interface DashboardProps {
  onTopicSelect: (topic: string) => void;
  history: Evaluation[];
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onViewHistory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTopicSelect, history, onSelectEvaluation, onViewHistory }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Main Action Card */}
            <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 font-bold rounded-full flex-shrink-0">1</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('select-task-and-speak')}</h2>
                </div>
                <p className="text-slate-500 mb-6 ml-12 text-sm sm:text-base">{t('select-task-desc')}</p>
                <TopicSelector onTopicSelect={onTopicSelect} />
            </div>

            {/* Side Column with History and Mascot */}
            <div className="lg:col-span-2 space-y-8">
                <RecentHistory 
                    history={history}
                    onSelectEvaluation={onSelectEvaluation}
                    onViewAll={onViewHistory}
                />

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="bg-slate-50/70 rounded-xl p-6 text-center">
                        <video
                            src="https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/dosyalar/2025_11/03215808_yellowbirb.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-40 h-40 sm:w-48 sm:h-48 mx-auto -mt-10 sm:-mt-12 mb-4 object-cover rounded-full border-4 border-white shadow-lg"
                            aria-label="Animated mascot"
                        ></video>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{t('ready-to-start')}</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm sm:text-base">{t('ready-to-start-desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;