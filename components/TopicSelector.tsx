import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SPEAKING_TOPICS } from '../constants';

interface TopicSelectorProps {
  onTopicSelect: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onTopicSelect }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('tr') ? 'tr' : 'en';
  const topicsByLang = SPEAKING_TOPICS[currentLang];
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleStart = () => {
    if (selectedTopic) {
      onTopicSelect(selectedTopic);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
          aria-label={t('Bir konuşma görevi seçin...') as string}
        >
          <option value="" disabled>{t('Bir konuşma görevi seçin...')}</option>
          {Object.entries(topicsByLang).map(([category, topicList]) => (
            <optgroup label={category} key={category}>
              {topicList.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      
      <div className="flex items-center text-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">{t('VEYA')}</span>
          <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleStart}
            disabled={!selectedTopic}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">mic</span>
            <span>{t('Kayda Başla')}</span>
          </button>
          
          <button
             disabled
             className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
             title={t('feature-not-available') as string}
          >
            <span className="material-symbols-outlined">upload_file</span>
            <span>{t('Ses Yükle')}</span>
          </button>
      </div>
    </div>
  );
};

export default TopicSelector;