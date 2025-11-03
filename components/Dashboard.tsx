import React from 'react';
import { useTranslation } from 'react-i18next';
import TopicSelector from './TopicSelector';

const ROBOT_IMAGE_URL = 'https://storage.googleapis.com/aistudio-templates/creation-lab/robot.png'; 

interface DashboardProps {
  onTopicSelect: (topic: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTopicSelect }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 font-bold rounded-full flex-shrink-0">1</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('select-task-and-speak')}</h2>
                </div>
                <p className="text-slate-500 mb-6 ml-12 text-sm sm:text-base">{t('select-task-desc')}</p>
                <TopicSelector onTopicSelect={onTopicSelect} />
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 font-bold rounded-full flex-shrink-0">2</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t('review-results')}</h2>
                </div>
                <p className="text-slate-500 mb-6 ml-12 text-sm sm:text-base">{t('review-results-desc')}</p>
                <div className="bg-slate-50/70 rounded-xl p-6 text-center">
                    <img src={ROBOT_IMAGE_URL} alt="SpeakSmart Mascot" className="w-40 h-40 sm:w-48 sm:h-48 mx-auto -mt-16 mb-4 object-contain" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{t('ready-to-start')}</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm sm:text-base">{t('ready-to-start-desc')}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;