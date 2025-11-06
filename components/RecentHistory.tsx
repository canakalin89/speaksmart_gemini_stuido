import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Evaluation } from '../types';

interface RecentHistoryProps {
  history: Evaluation[];
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onViewAll: () => void;
}

const RecentHistory: React.FC<RecentHistoryProps> = ({ history, onSelectEvaluation, onViewAll }) => {
  const { t } = useTranslation();
  const recentAttempts = history.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('recent-attempts')}</h2>
        {history.length > 3 && (
          <button onClick={onViewAll} className="text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md px-2 py-1">
            {t('view-all')}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {recentAttempts.length > 0 ? (
          recentAttempts.map(evaluation => (
            <div
              key={evaluation.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectEvaluation(evaluation)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectEvaluation(evaluation); } }}
              className="w-full text-left p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-700/50 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-200 flex justify-between items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="overflow-hidden pr-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate" title={evaluation.topic}>{evaluation.topic}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(evaluation.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-lg font-bold text-amber-600">{evaluation.overallScore}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">{t('no-recent-attempts')}</p>
        )}
      </div>
    </div>
  );
};

export default RecentHistory;