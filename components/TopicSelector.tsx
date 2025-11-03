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
  const [freestyleTopic, setFreestyleTopic] = useState('');

  const handleFreestyleStart = () => {
    onTopicSelect(freestyleTopic.trim() || t('freestyle-default'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      
      {/* Freestyle Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">{t('freestyle-title')}</h2>
        <p className="text-zinc-600 mb-4">{t('freestyle-desc')}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={freestyleTopic}
            onChange={(e) => setFreestyleTopic(e.target.value)}
            placeholder={t('freestyle-placeholder') as string}
            className="flex-grow px-4 py-2 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
          />
          <button
            onClick={handleFreestyleStart}
            className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {t('start-freestyle')}
          </button>
        </div>
      </div>

      {/* Predefined Topics Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
        <h2 className="text-2xl font-bold text-zinc-800 mb-4">{t('or-select-topic')}</h2>
        <div className="space-y-6">
          {Object.entries(topicsByLang).map(([category, topicList]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-zinc-700 mb-3 border-b border-zinc-200 pb-2">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topicList.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => onTopicSelect(topic)}
                    className="w-full text-left p-4 bg-white rounded-lg border border-zinc-200 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 group"
                  >
                    <span className="text-zinc-800 group-hover:text-indigo-700">{topic}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicSelector;