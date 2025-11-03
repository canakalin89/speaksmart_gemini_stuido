import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RecorderProps {
  topic: string;
  onRecordingComplete: (audioBlob: Blob, mimeType: string) => void;
  onBack: () => void;
}

const MAX_RECORDING_TIME_SECONDS = 120; // 2 minutes
const MIN_RECORDING_DURATION_SECONDS = 2; // 2 seconds minimum

const Recorder: React.FC<RecorderProps> = ({ topic, onRecordingComplete, onBack }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(MAX_RECORDING_TIME_SECONDS);
  
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerInterval = useRef<number | null>(null);

  // Refs for silence detection
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const silenceCheckInterval = useRef<number | null>(null);
  const isSilent = useRef(true);

  // Refs for managing state in callbacks
  const proceedToEvaluation = useRef(true);
  const timerRef = useRef(timer);
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    // This effect handles cleanup when the component unmounts.
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (silenceCheckInterval.current) clearInterval(silenceCheckInterval.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      
      const contextToClose = audioContext.current;
      audioContext.current = null;
      if (contextToClose && contextToClose.state !== 'closed') {
        contextToClose.close();
      }
    };
  }, []);
  
  const getMicPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mediaStream;
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
    let currentStream = streamRef.current;
    if (!currentStream) {
      currentStream = await getMicPermission();
    }
    
    if (!currentStream) return;

    setIsRecording(true);
    setTimer(MAX_RECORDING_TIME_SECONDS);
    audioChunks.current = [];
    proceedToEvaluation.current = true;
    isSilent.current = true;
    
    // --- Silence Detection Setup ---
    try {
      if (!audioContext.current || audioContext.current.state === 'closed') {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const source = audioContext.current.createMediaStreamSource(currentStream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 512;
      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);
      source.connect(analyser.current);

      silenceCheckInterval.current = window.setInterval(() => {
        if (!analyser.current || !dataArray.current) return;
        analyser.current.getByteTimeDomainData(dataArray.current);
        let sumSquares = 0.0;
        for (const amplitude of dataArray.current) {
            const normalized = (amplitude / 128.0) - 1.0;
            sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / dataArray.current.length);
        const SILENCE_THRESHOLD = 0.01;
        if (rms > SILENCE_THRESHOLD) {
            isSilent.current = false;
        }
      }, 250);
    } catch (e) {
      console.error("Could not set up silence detection:", e);
      // Failsafe: if audio context fails, proceed without silence detection.
      isSilent.current = false; 
    }
    // --- End Silence Detection ---
    
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
      if (proceedToEvaluation.current && audioChunks.current.length > 0) {
        const mimeType = mediaRecorder.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        onRecordingComplete(audioBlob, mimeType);
      } else if (!proceedToEvaluation.current) {
        setTimer(MAX_RECORDING_TIME_SECONDS);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      const contextToClose = audioContext.current;
      audioContext.current = null;
      if (contextToClose && contextToClose.state !== 'closed') {
        contextToClose.close();
      }
    };
    
    mediaRecorder.current.start();
    
    timerInterval.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      if (silenceCheckInterval.current) {
        clearInterval(silenceCheckInterval.current);
        silenceCheckInterval.current = null;
      }
        
      const elapsedTime = MAX_RECORDING_TIME_SECONDS - timerRef.current;
        
      if (elapsedTime < MIN_RECORDING_DURATION_SECONDS || isSilent.current) {
          proceedToEvaluation.current = false;
          alert(t('no-audio-detected'));
      } else {
          proceedToEvaluation.current = true;
      }
        
      mediaRecorder.current.stop();
    }
    setIsRecording(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
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
          className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Retry Mic Access
        </button>
      )
    }
    
    const circumference = 2 * Math.PI * 57;
    const offset = circumference * (1 - timer / MAX_RECORDING_TIME_SECONDS);

    return (
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        {isRecording && (
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              className="text-zinc-200"
              stroke="currentColor" strokeWidth="6" fill="transparent"
              r="57" cx="60" cy="60"
            />
            {/* Progress indicator */}
            <circle
              className="text-amber-500"
              stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="transparent"
              r="57" cx="60" cy="60"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                transition: 'stroke-dashoffset 0.5s linear',
              }}
            />
          </svg>
        )}
        <div className="relative">
          {isRecording && <div className="absolute inset-[-6px] rounded-full bg-amber-500/30 animate-ping"></div>}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'
            } text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400`}
            aria-label={isRecording ? t('stop-recording') as string : t('start-recording') as string}
          >
            {isRecording ? <span className="material-symbols-outlined text-4xl">stop</span> : <span className="material-symbols-outlined text-4xl">mic</span>}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center bg-white rounded-xl shadow-sm border border-zinc-200 relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-zinc-500 hover:text-zinc-800 p-2 rounded-full hover:bg-zinc-100 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <h1 className="text-lg font-medium text-zinc-500 mb-1">{t('you-spoke-about')}</h1>
      <p className="text-xl sm:text-2xl font-bold text-zinc-800 mb-8 px-4 sm:px-8">{topic}</p>
      
      <div className="w-full h-32 flex items-center justify-center">
        {renderMicButton()}
      </div>

      <div className="mt-8 text-zinc-600 h-16 flex flex-col justify-center">
        {isRecording ? (
          <>
            <p className="text-lg text-amber-600 font-medium">{t('recording-in-progress')}</p>
            <p className="text-2xl font-mono mt-1 text-zinc-800">{formatTime(timer)}</p>
          </>
        ) : (
          <p className="text-zinc-500 max-w-xs">{t('recording-instructions')}</p>
        )}
      </div>
    </div>
  );
};

export default Recorder;