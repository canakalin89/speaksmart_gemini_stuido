import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Dashboard from './components/Dashboard';
import Recorder from './components/Recorder';
import EvaluationResult from './components/EvaluationResult';
import HistoryView from './components/HistoryView';
import { evaluateSpeech } from './services/geminiService';
import { blobToBase64 } from './utils/audioUtils';
import type { Evaluation, EvaluationResultData } from './types';
import { Logo } from './components/icons/Logo';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { SPEAKING_TOPICS } from './constants';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<'dashboard' | 'recorder' | 'evaluating' | 'result' | 'history'>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResultData | null>(null);
  const [latestAudioBlob, setLatestAudioBlob] = useState<Blob | null>(null);
  const [history, setHistory] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentLang = i18n.language.startsWith('tr') ? 'tr' : 'en';

  useEffect(() => {
    document.title = `SpeakSmart - ${t('app-header-subtitle')}`;
  }, [t, i18n.language]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('speaksmart-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error("Failed to load history from localStorage", err);
    }
  }, []);

  useEffect(() => {
    try {
      if (history.length > 0) {
        localStorage.setItem('speaksmart-history', JSON.stringify(history));
      } else {
        localStorage.removeItem('speaksmart-history');
      }
    } catch (err) {
      console.error("Failed to save history to localStorage", err);
    }
  }, [history]);

  const allTopics = useMemo(() => {
    const topicsByLang = SPEAKING_TOPICS[currentLang];
    return Object.values(topicsByLang).flat();
  }, [currentLang]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setView('recorder');
  };

  const handleRecordingComplete = async (audioBlob: Blob, mimeType: string) => {
    if (!selectedTopic) return;
    setLatestAudioBlob(audioBlob);
    setIsLoading(true);
    setView('evaluating');
    setError(null);
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      const result = await evaluateSpeech(audioBase64, mimeType, selectedTopic, allTopics, currentLang);
      
      const newEvaluation: Evaluation = {
        ...result,
        id: new Date().toISOString(),
        date: new Date().toISOString(),
      };
      
      setEvaluationResult(result);
      setHistory(prev => [newEvaluation, ...prev]);
      setView('result');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setView('dashboard'); // Go back to dashboard on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedTopic(null);
    setEvaluationResult(null);
    setLatestAudioBlob(null);
    setView('dashboard');
  };

  const handleBackToDashboard = () => {
    setSelectedTopic(null);
    setEvaluationResult(null);
    setLatestAudioBlob(null);
    setView('dashboard');
  }

  const handleViewHistory = () => {
    setView('history');
  };
  
  const handleSelectEvaluationFromHistory = (evaluation: Evaluation) => {
    setLatestAudioBlob(null); // No audio stored in history
    setEvaluationResult(evaluation);
    setView('result');
  }

  const handleDeleteEvaluation = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }

  const handleDeleteAll = () => {
    setHistory([]);
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  const renderContent = () => {
    if (isLoading || view === 'evaluating') {
      return (
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-zinc-200">
           <video
              src="https://azizsancaranadolu.meb.k12.tr/meb_iys_dosyalar/59/11/765062/dosyalar/2025_11/03215808_yellowbirb.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-24 h-24 mx-auto mb-4 object-cover rounded-full animate-pulse"
              aria-label="Evaluating animation"
          ></video>
          <h2 className="text-2xl font-bold text-zinc-800">{t('evaluating-speech')}</h2>
          <p className="text-zinc-500 mt-2">{t('evaluation-wait')}</p>
        </div>
      );
    }

    switch (view) {
      case 'recorder':
        return <Recorder topic={selectedTopic!} onRecordingComplete={handleRecordingComplete} onBack={handleBackToDashboard} />;
      case 'result':
        return <EvaluationResult result={evaluationResult!} onTryAgain={handleTryAgain} audioBlob={latestAudioBlob} />;
      case 'history':
        return <HistoryView history={history} onSelectEvaluation={handleSelectEvaluationFromHistory} onBack={handleBackToDashboard} onDeleteEvaluation={handleDeleteEvaluation} onDeleteAll={handleDeleteAll} />;
      case 'dashboard':
      default:
        return <Dashboard onTopicSelect={handleTopicSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12"/>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SpeakSmart</h1>
                <p className="text-sm text-slate-500">{t('app-header-subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleViewHistory}
                className="flex items-center justify-center gap-2 text-slate-600 font-semibold px-3 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                title={t('view-history') as string}
              >
                <HistoryIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{t('evaluation-history')}</span>
              </button>
              <button
                onClick={toggleLanguage}
                className="text-slate-600 font-semibold px-3 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                {i18n.language === 'en' ? 'TR' : 'EN'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}
        {renderContent()}
      </main>

       <footer className="mt-auto p-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-slate-50">
          <div className="space-y-1">
              <p>
                  {t('credit_developer_prefix') ? `${t('credit_developer_prefix')} ` : ''}
                  <a href="https://instagram.com/can_akalin" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-500 hover:text-amber-600 transition-colors">
                      Can AKALIN
                  </a>
                  {t('credit_developer_suffix') ? ` ${t('credit_developer_suffix')}` : ''}
              </p>
              <p>
                  <a href="https://github.com/canakalin89/speaksmart_gemini_stuido" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-amber-600 transition-colors underline">
                      {t('credit_source')}
                  </a>
              </p>
              <p>{t('credit_powered_by')}</p>
          </div>
      </footer>
    </div>
  );
};

export default App;