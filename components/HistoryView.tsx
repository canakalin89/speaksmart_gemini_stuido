import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Evaluation } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryViewProps {
  history: Evaluation[];
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onBack: () => void;
  onDeleteEvaluation: (id: string) => void;
  onDeleteAll: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectEvaluation, onBack, onDeleteEvaluation, onDeleteAll }) => {
  const { t } = useTranslation();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the selection of the item
    if (window.confirm(t('confirm-delete') as string)) {
      onDeleteEvaluation(id);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm(t('confirm-delete-all') as string)) {
      onDeleteAll();
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-zinc-200">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button onClick={onBack} className="text-zinc-500 hover:text-zinc-800 p-2 rounded-full hover:bg-zinc-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 flex items-center text-center flex-grow">
          <span className="material-symbols-outlined text-3xl mr-2">history</span>
          {t('evaluation-history')}
        </h1>
        {history.length > 0 ? (
          <button onClick={handleDeleteAll} className="text-red-500 hover:text-red-700 text-sm font-semibold p-2 rounded-md hover:bg-red-50 transition-colors min-w-max">
            {t('deleteAll')}
          </button>
        ) : (
          <div className="w-12"></div> // Placeholder for alignment
        )}
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
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectEvaluation(evaluation)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectEvaluation(evaluation);
                    }
                  }}
                  className="w-full text-left p-4 bg-white rounded-lg border border-zinc-200 hover:shadow-md hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex justify-between items-center group cursor-pointer"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-zinc-800">{evaluation.topic}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(evaluation.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4 flex items-center gap-4">
                    <div>
                        <p className="text-sm text-zinc-500">{t('score')}</p>
                        <p className="text-xl font-bold text-amber-600">{evaluation.overallScore}</p>
                    </div>
                    <button onClick={(e) => handleDelete(e, evaluation.id)} className="text-zinc-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all" title={t('delete') as string}>
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryView;