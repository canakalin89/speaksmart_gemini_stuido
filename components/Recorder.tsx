import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RecorderProps {
  topic: string;
  onRecordingComplete: (audioBlob: Blob, mimeType: string) => void;
  onBack: () => void;
}

const MAX_RECORDING_TIME_SECONDS = 120; // 2 minutes

const Recorder: React.FC<RecorderProps> = ({ topic, onRecordingComplete, onBack }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerInterval = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  const getMicPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      setHasPermission(true);
      return mediaStream;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setHasPermission(false);
      alert("Microphone access was denied. Please allow microphone access in your browser settings to use this feature.");
      return null;
    }
  }

  const startRecording = async () => {
    let currentStream = stream;
    if (!currentStream) {
      currentStream = await getMicPermission();
    }
    
    if (!currentStream) return;

    setIsRecording(true);
    setTimer(0);
    audioChunks.current = [];
    
    // Determine supported MIME type
    const options = { mimeType: 'audio/webm;codecs=opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = ''; // Let browser decide
      }
    }
    
    mediaRecorder.current = new MediaRecorder(currentStream, options);
    
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      if (audioChunks.current.length > 0) {
        const mimeType = mediaRecorder.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        onRecordingComplete(audioBlob, mimeType);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    
    mediaRecorder.current.start();
    
    timerInterval.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev >= MAX_RECORDING_TIME_SECONDS - 1) {
          stopRecording();
          return MAX_RECORDING_TIME_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    setIsRecording(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const renderMicButton = () => {
    if (hasPermission === false) {
      return (
        <button
          onClick={getMicPermission}
          className="bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Retry Mic Access
        </button>
      )
    }
    
    return (
      <div className="relative">
        {isRecording && <div className="absolute inset-[-6px] rounded-full bg-indigo-500/30 animate-ping"></div>}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400`}
          aria-label={isRecording ? t('stop-recording') as string : t('start-recording') as string}
        >
          {isRecording ? <span className="material-symbols-outlined text-4xl">stop</span> : <span className="material-symbols-outlined text-4xl">mic</span>}
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center bg-white rounded-xl shadow-sm border border-zinc-200 relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-zinc-500 hover:text-zinc-800 p-2 rounded-full hover:bg-zinc-100 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <h1 className="text-lg font-medium text-zinc-500 mb-1">{t('you-spoke-about')}</h1>
      <p className="text-2xl font-bold text-zinc-800 mb-8 px-8">{topic}</p>
      
      <div className="w-full h-32 flex items-center justify-center">
        {renderMicButton()}
      </div>

      <div className="mt-8 text-zinc-600 h-16 flex flex-col justify-center">
        {isRecording ? (
          <>
            <p className="text-lg text-indigo-600 font-medium">{t('recording-in-progress')}</p>
            <p className="text-2xl font-mono mt-1 text-zinc-800">{formatTime(timer)} / {formatTime(MAX_RECORDING_TIME_SECONDS)}</p>
          </>
        ) : (
          <p className="text-zinc-500 max-w-xs">{t('recording-instructions')}</p>
        )}
      </div>
    </div>
  );
};

export default Recorder;