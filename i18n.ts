import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "freestyle-default": "Freestyle (Talk about any topic you want)",
      "freestyle-title": "Freestyle Speaking",
      "freestyle-desc": "Can't decide on a topic? Just start talking about anything that comes to your mind.",
      "freestyle-placeholder": "Or briefly describe your topic here...",
      "start-freestyle": "Start Freestyle",
      "or-select-topic": "Or, select a topic from the list below",
      "evaluation-results": "Evaluation Results",
      "topic": "Topic",
      "overall-score": "Overall Score",
      "feedback-summary": "Feedback Summary",
      "detailed-feedback": "Detailed Feedback",
      "rapport": "Rapport",
      "organisation": "Organisation",
      "delivery": "Delivery",
      "languageUse": "Language Use",
      "creativity": "Creativity",
      "pronunciation-feedback": "Pronunciation Feedback",
      "transcription": "Transcription",
      "try-again": "Try Another Topic",
      "evaluation-history": "Evaluation History",
      "no-history": "No evaluation history found.",
      "score": "Score",
      "no-audio-detected": "No audio was detected. Please try recording again.",
      "evaluating-speech": "Evaluating your speech...",
      "evaluation-wait": "This might take a moment. We're analyzing your recording.",
      "view-history": "View history",
      "stop-recording": "Stop Recording",
      "start-recording": "Start Recording",
      "recording-in-progress": "Recording...",
      "get-ready": "Get ready to speak...",
      "you-spoke-about": "You spoke about:",
      "recording-instructions": "Click the microphone to start recording. You'll have up to 2 minutes.",
    },
  },
  tr: {
    translation: {
      "freestyle-default": "Serbest Konuşma (İstediğiniz bir konu hakkında konuşun)",
      "freestyle-title": "Serbest Konuşma",
      "freestyle-desc": "Bir konu seçemiyor musunuz? Aklınıza gelen herhangi bir şey hakkında konuşmaya başlayın.",
      "freestyle-placeholder": "Veya konunuzu kısaca buraya yazın...",
      "start-freestyle": "Serbest Başla",
      "or-select-topic": "Veya aşağıdaki listeden bir konu seçin",
      "evaluation-results": "Değerlendirme Sonuçları",
      "topic": "Konu",
      "overall-score": "Genel Puan",
      "feedback-summary": "Geri Bildirim Özeti",
      "detailed-feedback": "Detaylı Geri Bildirim",
      "rapport": "Bağ Kurma",
      "organisation": "Organizasyon",
      "delivery": "Sunum",
      "languageUse": "Dil Kullanımı",
      "creativity": "Yaratıcılık",
      "pronunciation-feedback": "Telaffuz Geri Bildirimi",
      "transcription": "Transkripsiyon",
      "try-again": "Başka Bir Konu Dene",
      "evaluation-history": "Değerlendirme Geçmişi",
      "no-history": "Değerlendirme geçmişi bulunamadı.",
      "score": "Puan",
      "no-audio-detected": "Ses algılanamadı. Lütfen tekrar kaydetmeyi deneyin.",
      "evaluating-speech": "Konuşmanız değerlendiriliyor...",
      "evaluation-wait": "Bu işlem biraz zaman alabilir. Kaydınız analiz ediliyor.",
      "view-history": "Geçmişi görüntüle",
      "stop-recording": "Kaydı Durdur",
      "start-recording": "Kaydı Başlat",
      "recording-in-progress": "Kayıt yapılıyor...",
      "get-ready": "Konuşmaya hazırlanın...",
      "you-spoke-about": "Şu konu hakkında konuştunuz:",
      "recording-instructions": "Kayda başlamak için mikrofona tıklayın. 2 dakikaya kadar süreniz olacak.",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "tr", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;