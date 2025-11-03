# SpeakSmart - Yapay Zeka Destekli İngilizce Konuşma Koçu

SpeakSmart, kullanıcıların yapay zeka destekli değerlendirme ile İngilizce konuşma becerilerini geliştirmelerine yardımcı olmak için tasarlanmış modern, web tabanlı bir uygulamadır. Kullanıcılar çeşitli konularda konuşmalarını kaydedebilir ve performansları hakkında anında, ayrıntılı geri bildirim alabilirler.

Arayüz minimal, profesyonel ve tamamen duyarlıdır; hem **Türkçe** hem de **İngilizce** dillerinde sorunsuz bir deneyim sunar.

![SpeakSmart Screenshot](https://i.imgur.com/8a83j2a.png)

---

## ✨ Temel Özellikler

*   **Yapay Zeka Destekli Değerlendirme:** Konuşulan İngilizce'nin sofistike bir analizini sağlamak için Google Gemini API'sini kullanır.
*   **Kapsamlı Geri Bildirim:** Konuşmayı beş ana kritere göre değerlendirir:
    1.  **Bağ Kurma (Rapport):** Dinleyici ile bağ kurma.
    2.  **Organizasyon (Organisation):** Düşünceleri mantıksal olarak yapılandırma.
    3.  **Sunum (Delivery):** Netlik, hız ve tonlama.
    4.  **Dil Kullanımı (Language Use):** Kelime dağarcığı ve dilbilgisi doğruluğu.
    5.  **Yaratıcılık (Creativity):** Fikirlerin özgünlüğü.
*   **Eyleme Yönelik Öneriler:** Türk öğrenciler için özel olarak hazırlanmış telaffuz analizi de dahil olmak üzere, spesifik ve örnek tabanlı geri bildirimler sunar.
*   **Tam Konuşma Metni:** Kullanıcının konuşmasının tam bir dökümünü (transkript) oluşturur.
*   **Zengin Konu Kütüphanesi:** Aşağıdaki kategorilerde geniş bir konu yelpazesi içerir:
    *   Genel Konuşma Pratiği (CEFR uyumlu)
    *   IELTS Hazırlık
    *   TOEFL Hazırlık
*   **Akıllı Serbest Mod:** Kullanıcıların herhangi bir konuda konuşmasına olanak tanır ve yapay zeka konuyu akıllıca algılayıp kategorize eder.
*   **İki Dilli Arayüz:** Tüm uygulama hem İngilizce hem de Türkçe olarak yerelleştirilmiştir.
*   **Değerlendirme Geçmişi:** Tüm değerlendirmeleri otomatik olarak tarayıcının yerel depolama alanına kaydederek kullanıcıların zaman içindeki ilerlemelerini takip etmelerine olanak tanır.

---

## 🚀 Nasıl Çalışır?

1.  **Konu Seçin:** Kategorize edilmiş listelerden önceden tanımlanmış bir konu seçin veya "Serbest Konuşma" modunu tercih edin.
2.  **Konuşmanızı Kaydedin:** Mikrofon erişimine izin verin, ardından kayda başlamak için mikrofon simgesine tıklayın. Konuşmak için 2 dakikanız vardır.
3.  **Değerlendirme İçin Gönderin:** Kaydı durdurduktan sonra, ses dosyanız analiz için Gemini API'sine gönderilir.
4.  **Sonuçlarınızı İnceleyin:** Saniyeler içinde aşağıdaki detayları içeren ayrıntılı bir rapor alırsınız:
    *   100 üzerinden genel bir puan.
    *   Beş ana kriterin her biri için 1-5 arasında bir puan.
    *   Performansınızın yazılı bir özeti.
    *   Her kriter için ayrıntılı geri bildirim.
    *   Spesifik telaffuz düzeltmeleri.
    *   Konuşmanızın tam metni.

---

## 🛠️ Teknoloji Yığını

*   **Frontend Framework:** React ve TypeScript
*   **Stil (Styling):** Utility-first ve duyarlı bir tasarım için Tailwind CSS.
*   **Yapay Zeka & Değerlendirme:** Google Gemini API (`@google/genai`)
*   **Uluslararasılaştırma (i18n):** İngilizce ve Türkçe dil desteği için `i18next` ve `react-i18next`.
*   **Web API'leri:**
    *   Doğrudan tarayıcıda ses yakalamak için `MediaRecorder API`.
    *   Ses verilerini işlemek için `FileReader API`.

---

## 📂 Proje Yapısı

Proje, standart bir React bileşen tabanlı mimariyi takip eder:

```
/
├── components/          # Yeniden kullanılabilir React bileşenleri
│   ├── icons/           # SVG ikon bileşenleri
│   ├── TopicSelector.tsx  # Konu seçimi için başlangıç görünümü
│   ├── Recorder.tsx       # Ses kaydını ve gönderimini yönetir
│   ├── EvaluationResult.tsx # Nihai değerlendirmeyi gösterir
│   └── HistoryView.tsx    # Geçmiş değerlendirmelerin bir listesini gösterir
│
├── services/            # Harici API çağrıları için modüller
│   └── geminiService.ts   # Gemini API ile etkileşim mantığı
│
├── utils/               # Yardımcı fonksiyonlar
│   └── audioUtils.ts      # Ses verisi işleme yardımcıları
│
├── App.tsx              # Ana uygulama bileşeni, durumu ve görünümleri yönetir
├── constants.ts         # Uygulama genelindeki sabitler (konular, kriterler)
├── i18n.ts              # Uluslararasılaştırma yapılandırması
└── types.ts             # TypeScript tip tanımları
```

---
<br>

# SpeakSmart - AI English Speaking Coach

SpeakSmart is a modern, web-based application designed to help users improve their English speaking skills through AI-powered evaluation. Users can record themselves speaking on a variety of topics and receive instant, detailed feedback on their performance.

The interface is minimal, professional, and fully responsive, offering a seamless experience in both **Turkish** and **English**.

---

## ✨ Core Features

*   **AI-Powered Evaluation:** Leverages the Google Gemini API to provide sophisticated analysis of spoken English.
*   **Comprehensive Feedback:** Evaluates speech across five key criteria:
    1.  **Rapport:** Connecting with the listener.
    2.  **Organisation:** Structuring thoughts logically.
    3.  **Delivery:** Clarity, pace, and tone.
    4.  **Language Use:** Vocabulary and grammar accuracy.
    5.  **Creativity:** Originality of ideas.
*   **Actionable Suggestions:** Provides specific, example-based feedback, including pronunciation analysis tailored for Turkish learners.
*   **Full Transcription:** Generates a complete transcript of the user's speech for review.
*   **Rich Topic Library:** Includes a wide range of topics categorized for:
    *   General Speaking Practice (CEFR-aligned)
    *   IELTS Preparation
    *   TOEFL Preparation
*   **Intelligent Freestyle Mode:** Allows users to speak on any topic, with the AI intelligently detecting and categorizing the subject matter.
*   **Bilingual Interface:** The entire application is localized in both English and Turkish.
*   **Evaluation History:** Automatically saves all evaluations to the browser's local storage, allowing users to track their progress over time.

---

## 🚀 How It Works

1.  **Select a Topic:** Choose a predefined topic from the categorized lists or opt for the "Freestyle" mode.
2.  **Record Your Speech:** Grant microphone access, then click the microphone icon to start recording. You have up to 2 minutes to speak.
3.  **Submit for Evaluation:** Once you stop the recording, your audio is sent to the Gemini API for analysis.
4.  **Review Your Results:** Within seconds, you'll receive a detailed report including:
    *   An overall score out of 100.
    *   A 1-5 score for each of the five core criteria.
    *   A written summary of your performance.
    *   Detailed feedback for each criterion.
    *   Specific pronunciation corrections.
    *   The full transcription of your speech.

---

## 🛠️ Technology Stack

*   **Frontend Framework:** React with TypeScript
*   **Styling:** Tailwind CSS for a utility-first, responsive design.
*   **AI & Evaluation:** Google Gemini API (`@google/genai`)
*   **Internationalization (i18n):** `i18next` and `react-i18next` for English and Turkish language support.
*   **Web APIs:**
    *   `MediaRecorder API` for capturing audio directly in the browser.
    *   `FileReader API` for processing audio data.

---

## 📂 Project Structure

The project follows a standard React component-based architecture:

```
/
├── components/          # Reusable React components
│   ├── icons/           # SVG icon components
│   ├── TopicSelector.tsx  # Initial view for topic selection
│   ├── Recorder.tsx       # Handles audio recording and submission
│   ├── EvaluationResult.tsx # Displays the final evaluation
│   └── HistoryView.tsx    # Shows a list of past evaluations
│
├── services/            # Modules for external API calls
│   └── geminiService.ts   # Logic for interacting with the Gemini API
│
├── utils/               # Helper functions
│   └── audioUtils.ts      # Audio data processing utilities
│
├── App.tsx              # Main application component, manages state and views
├── constants.ts         # Application-wide constants (topics, criteria)
├── i18n.ts              # Internationalization configuration
└── types.ts             # TypeScript type definitions
```
