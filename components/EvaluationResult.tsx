import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { EvaluationResultData } from '../types';
import { CRITERIA } from '../constants';

interface EvaluationResultProps {
  result: EvaluationResultData;
  onTryAgain: () => void;
  audioBlob?: Blob | null;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const percentage = score;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-green-500';
  if (percentage < 75) colorClass = 'text-yellow-500';
  if (percentage < 50) colorClass = 'text-red-500';

  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
        />
        <circle
          className={colorClass}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">/ 100</span>
      </div>
    </div>
  );
};

const EvaluationResult: React.FC<EvaluationResultProps> = ({ result, onTryAgain, audioBlob }) => {
  const { t, i18n } = useTranslation();
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const currentLang = i18n.language.startsWith('tr') ? 'tr' : 'en';
  const criteria = CRITERIA[currentLang];

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-slate-800 dark:text-slate-200">{t('evaluation-results')}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t('topic')}: {result.topic}</p>
      </div>

      {/* Highlights Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-start gap-8">
        <ScoreCircle score={result.overallScore} />
        <div className="w-full text-center md:text-left">
          <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">{t('feedback-summary')}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{result.feedback.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed Feedback */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">{t('detailed-feedback')}</h2>
          <div className="space-y-5">
            {criteria.map(c => (
              <div key={c.key}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t(c.key)}</h3>
                   <span className="text-sm font-semibold text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/20 px-2 py-0.5 rounded">{result.scores[c.key]}/5</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{result.feedback[c.key]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Pronunciation */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">{t('pronunciation-feedback')}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{result.feedback.pronunciation}</p>
          </div>

          {/* Transcription */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('transcription')}</h2>
                {audioURL && (
                    <div className="flex-shrink-0">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1 text-left sm:text-right">{t('listen-recording')}</p>
                        <audio controls src={audioURL} className="h-10 w-full sm:w-auto max-w-xs"></audio>
                    </div>
                )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">{result.feedback.transcription}</p>
          </div>
        </div>
      </div>
       <div className="text-center pt-4">
            <button onClick={onTryAgain} className="bg-amber-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-amber-600 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
                {t('try-again')}
            </button>
        </div>
    </div>
  );
};

export default EvaluationResult;