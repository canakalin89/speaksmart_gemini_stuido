
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAI_Blob } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper function to encode audio data to base64
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to create a GenAI Blob from audio data
function createBlob(data: Float32Array): GenAI_Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface RecorderProps {
  topic: string;
  onRecordingComplete: (audioBlob: Blob, mimeType: string) => void;
  onBack: () => void;
}

const MAX_RECORDING_TIME_SECONDS = 180; // 3 minutes
const MIN_RECORDING_DURATION_SECONDS = 2; // 2 seconds minimum

const Recorder: React.FC<RecorderProps> = ({ topic, onRecordingComplete, onBack }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(MAX_RECORDING_TIME_SECONDS);
  const [liveTranscript, setLiveTranscript] = useState('');
  
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

  // Refs for Live API session
  const sessionPromise = useRef<Promise<any> | null>(null);
  const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
  const sourceNode = useRef<MediaStreamAudioSourceNode | null>(null);

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
      
      if(sessionPromise.current) {
        sessionPromise.current.then(session => session.close());
      }
      
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
    setLiveTranscript('');
    
    try {
      if (!audioContext.current || audioContext.current.state === 'closed') {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      sourceNode.current = audioContext.current.createMediaStreamSource(currentStream);
      
      // --- Silence Detection Setup ---
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 512;
      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);
      sourceNode.current.connect(analyser.current);

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

       // --- Live Transcription Setup ---
      sessionPromise.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            if (!audioContext.current || !sourceNode.current) return;
            scriptProcessor.current = audioContext.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            sourceNode.current.connect(scriptProcessor.current);
            scriptProcessor.current.connect(audioContext.current.destination);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setLiveTranscript(prev => prev + text);
            }
            if (message.serverContent?.turnComplete) {
              setLiveTranscript(prev => prev + ' ');
            }
          },
          onerror: (e: ErrorEvent) => console.error('Live API Error:', e),
          onclose: () => {},
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
        }
      });

    } catch (e) {
      console.error("Could not set up audio processing:", e);
      isSilent.current = false; 
    }
    
    // --- MediaRecorder for final evaluation ---
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
       if (sessionPromise.current) {
        sessionPromise.current.then(session => session.close());
        sessionPromise.current = null;
      }
      if (scriptProcessor.current) {
        scriptProcessor.current.disconnect();
        scriptProcessor.current = null;
      }
      if (sourceNode.current) {
        sourceNode.current.disconnect();
        sourceNode.current = null;
      }

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
      <p className="text-xl sm:text-2xl font-bold text-zinc-800 mb-6 px-4 sm:px-8">{topic}</p>
      
      <div className="w-full h-32 flex items-center justify-center">
        {renderMicButton()}
      </div>

      <div className="mt-6 text-zinc-600 h-10 flex flex-col justify-center">
        {isRecording ? (
          <>
            <p className="text-lg text-amber-600 font-medium">{t('recording-in-progress')}</p>
            <p className="text-2xl font-mono mt-1 text-zinc-800">{formatTime(timer)}</p>
          </>
        ) : (
          <p className="text-zinc-500 max-w-xs">{t('recording-instructions')}</p>
        )}
      </div>

      <div className="mt-4 w-full h-36 bg-slate-50 border border-slate-200 rounded-lg p-3 text-left overflow-y-auto">
        <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed" aria-live="polite">
          {liveTranscript || <span className="text-slate-400 italic">{t('live-transcription-placeholder')}</span>}
        </p>
      </div>
    </div>
  );
};

export default Recorder;
