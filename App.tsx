import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TopicSelector from './components/TopicSelector';
import Recorder from './components/Recorder';
import EvaluationResult from './components/EvaluationResult';
import HistoryView from './components/HistoryView';
import { evaluateSpeech } from './services/geminiService';
import { blobToBase64 } from './utils/audioUtils';
import type { Evaluation, EvaluationResultData } from './types';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { SoundwaveIcon } from './components/icons/SoundwaveIcon';
import { SPEAKING_TOPICS } from './constants';

type View = 'topic' | 'recorder' | 'evaluating' | 'result' | 'history';

function App() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<View>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResultData | null>(null);
  const [history, setHistory] = useState<Evaluation[]>([]);

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

  const saveToHistory = (result: EvaluationResultData) => {
    const newEvaluation: Evaluation = {
      ...result,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    const updatedHistory = [newEvaluation, ...history];
    setHistory(updatedHistory);
    try {
      localStorage.setItem('speechCoachHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
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
      const result = await evaluateSpeech(audioBase64, mimeType, selectedTopic, allTopics);
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
        return <TopicSelector onTopicSelect={handleTopicSelect} />;
      case 'recorder':
        return <Recorder topic={selectedTopic} onRecordingComplete={handleRecordingComplete} onBack={handleBackToHome} />;
      case 'evaluating':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-zinc-200">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-zinc-700">{t('evaluating-speech')}</p>
            <p className="mt-1 text-sm text-zinc-500">{t('evaluation-wait')}</p>
          </div>
        );
      case 'result':
        return evaluationResult && <EvaluationResult result={evaluationResult} onTryAgain={handleBackToHome} />;
      case 'history':
          return <HistoryView history={history} onSelectEvaluation={handleSelectFromHistory} onBack={handleBackToHome} />;
      default:
        return <TopicSelector onTopicSelect={handleTopicSelect} />;
    }
  };

  const handleLanguageChange = (lang: 'en' | 'tr') => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="bg-zinc-50 min-h-screen font-sans">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-zinc-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={handleBackToHome} className="flex items-center gap-2 text-xl font-bold text-zinc-800 transition-opacity hover:opacity-80">
            <SoundwaveIcon className="w-7 h-7 text-indigo-600" />
            <span>SpeakSmart</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleViewHistory} className="text-zinc-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-zinc-200" title={t('view-history') ?? ''}>
              <HistoryIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center bg-zinc-200 rounded-lg p-1">
                <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${i18n.language.startsWith('en') ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-600'}`}>EN</button>
                <button onClick={() => handleLanguageChange('tr')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${i18n.language.startsWith('tr') ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-600'}`}>TR</button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex items-start justify-center" style={{minHeight: 'calc(100vh - 65px)'}}>
        {renderView()}
      </main>
    </div>
  );
}

export default App;