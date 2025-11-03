import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Evaluation } from '../types';

interface HistoryViewProps {
  history: Evaluation[];
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectEvaluation, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-zinc-200">
      <div className="flex items-center mb-6 relative justify-center">
        <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 p-2 rounded-full hover:bg-zinc-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-zinc-800 flex items-center">
          <span className="material-symbols-outlined text-3xl mr-2">history</span>
          {t('evaluation-history')}
        </h1>
      </div>

      <div className="border-t border-zinc-200">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500">{t('no-history')}</p>
          </div>
        ) : (
          <ul className="space-y-3 pt-4">
            {history.map((evaluation) => (
              <li key={evaluation.id}>
                <button
                  onClick={() => onSelectEvaluation(evaluation)}
                  className="w-full text-left p-4 bg-white rounded-lg border border-zinc-200 hover:shadow-md hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-zinc-800">{evaluation.topic}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(evaluation.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm text-zinc-500">{t('score')}</p>
                    <p className="text-xl font-bold text-indigo-600">{evaluation.overallScore}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryView;