import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Recorder from './components/Recorder';
import EvaluationResult from './components/EvaluationResult';
import HistoryView from './components/HistoryView';
import Dashboard from './components/Dashboard';
import { evaluateSpeech } from './services/geminiService';
import { blobToBase64 } from './utils/audioUtils';
import type { Evaluation, EvaluationResultData } from './types';
import { SPEAKING_TOPICS } from './constants';

import { DashboardIcon } from './components/icons/DashboardIcon';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { Logo } from './components/icons/Logo';

type View = 'topic' | 'recorder' | 'evaluating' | 'result' | 'history';

function App() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<View>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResultData | null>(null);
  const [history, setHistory] = useState<Evaluation[]>([]);

  // Effect for initial load from localStorage (runs once on mount)
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('speechCoachHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  // Effect for persisting history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (history.length > 0) {
        localStorage.setItem('speechCoachHistory', JSON.stringify(history));
      } else {
        // If the history array is empty, remove the item from storage to keep it clean.
        const storedHistory = localStorage.getItem('speechCoachHistory');
        if (storedHistory) {
          localStorage.removeItem('speechCoachHistory');
        }
      }
    } catch (error) {
      console.error("Failed to update history in localStorage", error);
    }
  }, [history]);

  const saveToHistory = (result: EvaluationResultData) => {
    const newEvaluation: Evaluation = {
      ...result,
      id: new Date().toISOString() + Math.random(),
      date: new Date().toISOString(),
    };
    // Just update state. The useEffect hook will handle persisting to storage.
    setHistory(currentHistory => [newEvaluation, ...currentHistory]);
  };

  const handleDeleteEvaluation = (id: string) => {
    // Just update state. The useEffect hook will handle persisting to storage.
    setHistory(currentHistory => currentHistory.filter(item => item.id !== id));
  };

  const handleDeleteAllHistory = () => {
    // Just update state. The useEffect hook will handle persisting to storage.
    setHistory([]);
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setView('recorder');
  };

  const handleRecordingComplete = async (audioBlob: Blob, mimeType: string) => {
    if (audioBlob.size < 1000) { // 1KB threshold to ensure there's some data
      alert(t('no-audio-detected'));
      setView('recorder'); // Go back to recorder if the recording is empty
      return;
    }
    
    setView('evaluating');
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      const allTopics = Object.values(SPEAKING_TOPICS.en).flat();
      const currentLang = i18n.language.startsWith('tr') ? 'tr' : 'en';
      const result = await evaluateSpeech(audioBase64, mimeType, selectedTopic, allTopics, currentLang);
      setEvaluationResult(result);
      saveToHistory(result);
      setView('result');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
      setView('recorder'); // Go back to recorder on error
    }
  };

  const handleBackToHome = () => {
    setEvaluationResult(null);
    setSelectedTopic('');
    setView('topic');
  };
  
  const handleViewHistory = () => {
    setView('history');
  };
  
  const handleSelectFromHistory = (evaluation: Evaluation) => {
    setEvaluationResult(evaluation);
    setView('result');
  }

  const renderView = () => {
    switch (view) {
      case 'topic':
        return <Dashboard onTopicSelect={handleTopicSelect} />;
      case 'recorder':
        return <Recorder topic={selectedTopic} onRecordingComplete={handleRecordingComplete} onBack={handleBackToHome} />;
      case 'evaluating':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-zinc-200">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-zinc-700">{t('evaluating-speech')}</p>
            <p className="mt-1 text-sm text-zinc-500">{t('evaluation-wait')}</p>
          </div>
        );
      case 'result':
        return evaluationResult && <EvaluationResult result={evaluationResult} onTryAgain={handleBackToHome} />;
      case 'history':
          return <HistoryView 
                    history={history} 
                    onSelectEvaluation={handleSelectFromHistory} 
                    onBack={handleBackToHome}
                    onDeleteEvaluation={handleDeleteEvaluation}
                    onDeleteAll={handleDeleteAllHistory}
                 />;
      default:
        return <Dashboard onTopicSelect={handleTopicSelect} />;
    }
  };

  const handleLanguageChange = () => {
    const newLang = i18n.language.startsWith('en') ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex h-screen font-sans">
      <aside className="w-64 flex-shrink-0 bg-[#0f172a] text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
            <button onClick={handleBackToHome} className="flex items-center gap-3 text-xl font-bold text-white transition-opacity hover:opacity-80">
                <Logo className="w-8 h-8" />
                <span>SpeakSmart</span>
            </button>
        </div>
        
        <nav className="p-4 space-y-2">
            <button 
                onClick={handleBackToHome} 
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md font-semibold transition-colors text-left ${view === 'topic' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50'}`}
            >
                <DashboardIcon className="w-6 h-6 flex-shrink-0" />
                <span>{t('dashboard')}</span>
            </button>
            <button 
                onClick={handleViewHistory}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md font-semibold transition-colors text-left ${view === 'history' ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50'}`}
            >
                <HistoryIcon className="w-6 h-6 flex-shrink-0" />
                <span>{t('past-attempts')}</span>
            </button>
        </nav>
        
        <div className="flex-grow p-4 mt-2 border-t border-slate-700 overflow-y-auto">
            <h3 className="px-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">{t('recent-attempts')}</h3>
            <div className="mt-2 space-y-1">
                {history.length > 0 ? (
                    history.slice(0, 5).map(item => (
                        <button key={item.id} onClick={() => handleSelectFromHistory(item)} className="w-full text-left p-2 rounded-md hover:bg-slate-700/50 transition-colors">
                            <p className="font-medium text-slate-200 truncate">{item.topic}</p>
                            <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</p>
                        </button>
                    ))
                ) : (
                    <p className="px-2 py-2 text-sm text-slate-400">{t('no-attempts-yet')}</p>
                )}
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/70 backdrop-blur-lg border-b border-slate-200 flex-shrink-0">
            <div className="px-8 h-full flex justify-between items-center">
                <h1 className="text-xl font-semibold text-slate-700">{t('app-header-title')}</h1>
                <div className="flex items-center gap-4">
                    <button onClick={handleLanguageChange} className="text-slate-500 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-100 transition-colors" title={t('change-language') as string}>
                        <span className="material-symbols-outlined">translate</span>
                    </button>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl w-full mx-auto">
                 {renderView()}
            </div>
        </main>
      </div>
    </div>
  );
}

export default App;