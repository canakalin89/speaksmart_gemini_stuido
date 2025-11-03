import { GoogleGenAI, Type } from "@google/genai";
import type { EvaluationResultData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The topic of the speech. If the original topic was 'Freestyle', this should be the most relevant topic detected from the speech content. Otherwise, it's the original topic." },
    scores: {
      type: Type.OBJECT,
      properties: {
        rapport: { type: Type.INTEGER, description: "Score from 1 to 5 for rapport." },
        organisation: { type: Type.INTEGER, description: "Score from 1 to 5 for organisation." },
        delivery: { type: Type.INTEGER, description: "Score from 1 to 5 for delivery." },
        languageUse: { type: Type.INTEGER, description: "Score from 1 to 5 for language use." },
        creativity: { type: Type.INTEGER, description: "Score from 1 to 5 for creativity." },
      },
      required: ["rapport", "organisation", "delivery", "languageUse", "creativity"],
    },
    overallScore: { type: Type.INTEGER, description: "Overall score out of 100, calculated based on the criteria." },
    feedback: {
      type: Type.OBJECT,
      properties: {
        rapport: { type: Type.STRING, description: "Actionable, example-based feedback on rapport." },
        organisation: { type: Type.STRING, description: "Actionable, example-based feedback on organisation." },
        delivery: { type: Type.STRING, description: "Actionable, example-based feedback on delivery." },
        languageUse: { type: Type.STRING, description: "Actionable, example-based feedback on language use and grammar, with corrections." },
        creativity: { type: Type.STRING, description: "Actionable, example-based feedback on creativity and ideas." },
        pronunciation: { type: Type.STRING, description: "Specific feedback on pronunciation, listing mispronounced words and corrections. Acknowledges potential Turkish accent influences."},
        summary: { type: Type.STRING, description: "A brief overall summary of the performance with key suggestions for improvement." },
        transcription: { type: Type.STRING, description: "A verbatim transcript of the user's speech." },
      },
      required: ["rapport", "organisation", "delivery", "languageUse", "creativity", "pronunciation", "summary", "transcription"],
    },
  },
  required: ["topic", "scores", "overallScore", "feedback"],
};

export const evaluateSpeech = async (audioBase64: string, mimeType: string, topic: string, allTopics: string[], language: 'en' | 'tr'): Promise<EvaluationResultData> => {
  const isFreestyle = topic.toLowerCase().includes('freestyle') || topic.toLowerCase().includes('serbest');
  
  let prompt = '';

  if (language === 'tr') {
    prompt = `
    Sen, anadili İngilizce olmayan konuşmacıları eğitme konusunda uzmanlaşmış bir İngilizce konuşma değerlendirme uzmanısın. Kullanıcı muhtemelen Türkiye'den bir İngilizce öğrencisi.
    Sana bu kişinin belirli bir konuda yaptığı konuşmanın ses kaydını sunacağım.
    Görevin, konuşmayı analiz etmek ve JSON formatında ayrıntılı, eyleme geçirilebilir bir değerlendirme sunmaktır.
    
    **ÖNEMLİ: Geri bildirimler, özetler ve analizler dahil olmak üzere TÜM yanıtın Türkçe yazılmalıdır.**

    ${isFreestyle ? `
    **Bölüm 0: Konu Tespiti**
    Kullanıcı "Serbest Konuşma" yapmayı seçti. Değerlendirmeden önce, kullanıcının konuşmasını analiz etmeli ve aşağıdaki önceden tanımlanmış konulardan hangisinin en uygun eşleşme olduğunu belirlemelisin.
    
    Mevcut Konular: ${JSON.stringify(allTopics)}

    Bu listeden en iyi eşleşen tek konuyu seç. Tespit edilen bu konu, nihai JSON yanıtında 'topic' olarak KULLANILMALIDIR. Tüm değerlendirme, kullanıcı bu tespit edilen konuda konuşuyormuş gibi devam etmelidir. Hiçbir konu tam uyuşmuyorsa, 'Serbest Konuşma (İstediğiniz bir konu hakkında konuşun)' seçeneğini seçebilirsin.
    ` : `Konu: "${topic}"`}

    **Bölüm 1: Puanlama ve Geri Bildirim**
    Konuşmacıyı aşağıdaki beş kritere göre 1'den 5'e kadar bir ölçekte değerlendir (1=Ciddi Gelişim Gerekli, 5=Mükemmel):
    1.  **Bağ Kurma (Rapport)**:
        - Konuyu net bir şekilde anladığını gösterir.
        - Konuya doğrudan ve doğru bir şekilde değinir.
        - İlgili ayrıntılar sunar ve konuyu zenginleştirir.
    2.  **Organizasyon (Organisation)**:
        - Konuşmanın net bir başlangıcı, ortası ve sonu vardır.
        - Fikir akışı mantıklı ve iyi sıralanmıştır.
    3.  **Sunum (Delivery)**:
        - Güçlü ve net bir sesle konuşur.
        - Ses tonu, özgüveni ve duruşuyla dinleyiciyi etkiler.
        - Verilen süreyi etkili bir şekilde kullanır.
        - Telaffuzu net ve doğrudur.
    4.  **Dil Kullanımı (Language Use)**:
        - Doğru ve uygun dilbilgisi kuralları kullanır.
        - Kelime bilgisi konuyla ilgili ve etkili bir şekilde kullanılır.
    5.  **Yaratıcılık (Creativity)**:
        - Konuşmanın içeriği özgün ve ilginçtir.
        - Fikirler ilgi çekici bir şekilde sunulur.

    Bu beş kriter puanına dayanarak, 100 üzerinden bir genel puan da ver.

    Beş kriterin her biri için spesifik örneklerle eyleme geçirilebilir geri bildirim sağla.
    - Dilbilgisi zayıfsa, konuşmasından bir örnek ver ve düzeltilmiş halini göster (örneğin, "Sen 'I go yesterday' dedin, doğrusu 'I went yesterday' olmalı.").
    - Kelime bilgisi daha iyi olabilirse, alternatif kelimeler öner (örneğin, "'very big' yerine 'enormous' veya 'massive' kullanabilirsin.").
    - Sunum için, iyi veya anlaşılmayan belirli anlara yorum yap.

    **Bölüm 2: Telaffuz Analizi**
    Telaffuzun netliği ve doğruluğu 'Sunum' puanının önemli bir parçasıdır. Bunu Sunum puanına dahil etmenin yanı sıra, JSON'un 'pronunciation' alanında konuşmacının telaffuzu hakkında ayrı, detaylı geri bildirim sağla. Yanlış telaffuz edilen belirli kelimeleri belirle ve doğru telaffuzlarını sun.
    Konuşmacının Türkiye'den olması muhtemel olduğundan, Türkçe konuşanlar için yaygın olan telaffuz zorluklarına dikkat et (örneğin, 'w' ve 'v' farkı, 'th' sesleri, 'ship' ve 'sheep' gibi kelimelerdeki sesli harf farklılıkları).
    
    **Bölüm 3: Transkripsiyon**
    Kullanıcının konuşmasının birebir dökümünü (transkriptini) sağla. Bu, kullanıcının seste söylediği her şeyin temiz bir metin çıktısı olmalıdır.

    **Nihai Çıktı:**
    Tüm yanıtın, sağlanan şemayla eşleşen tek bir JSON nesnesi olmalıdır. JSON'daki 'topic' alanı, orijinal konuyla veya serbest konuşma için tespit ettiğin konuyla DOLDURULMALIDIR.
    **Unutma: JSON geri bildirimindeki tüm metinler Türkçe olmalıdır.**
    `;
  } else {
    // English prompt
    prompt = `
    You are an expert English speaking evaluator, specializing in coaching non-native speakers. The user is likely an English learner from Turkey.
    I will provide you with an audio recording of this person speaking on a given topic.
    Your task is to analyze the speech and provide a detailed, highly actionable evaluation in JSON format.
    
    **IMPORTANT: Your entire response, including all feedback, summaries, and analysis, MUST be written in English.**

    ${isFreestyle ? `
    **Part 0: Topic Detection**
    The user chose to do a "Freestyle" speech. Before evaluating, you MUST first analyze the user's speech and determine which of the following predefined topics is the most relevant match.
    
    Available Topics: ${JSON.stringify(allTopics)}

    Select the single best-matching topic from that list. This detected topic MUST be used as the 'topic' in your final JSON response. All evaluation should then proceed as if the user was speaking on this detected topic. If no topic is a good match, you can select 'Freestyle (Talk about any topic you want)'.
    ` : `Topic: "${topic}"`}

    **Part 1: Scoring & Feedback**
    Evaluate the speaker based on the following five criteria, each on a scale of 1 to 5 (1=Needs Significant Improvement, 5=Excellent):
    1.  **Rapport**:
        - Demonstrates a clear understanding of the subject.
        - Addresses the topic directly and accurately.
        - Provides relevant details and elaboration.
    2.  **Organisation**:
        - The speech has a clear beginning, middle, and end.
        - The flow of ideas is logical and well-sequenced.
    3.  **Delivery**:
        - Speaks with a strong and clear voice.
        - Engages the listener through vocal tone, confidence, and presence.
        - Effectively uses the allotted time.
        - Pronunciation is clear and accurate.
    4.  **Language Use**:
        - Uses accurate and appropriate grammar.
        - Vocabulary is relevant and effectively used for the topic.
    5.  **Creativity**:
        - The content of the speech is original and interesting.
        - Ideas are presented in an engaging way.

    Based on these five criteria scores, also provide an overall score out of 100.

    For each of the five criteria, provide actionable feedback with specific examples.
    - If grammar was weak, give an example from their speech and show the corrected version. (e.g., "You said 'I go yesterday', it should be 'I went yesterday'.")
    - If vocabulary could be better, suggest alternative words. (e.g., "Instead of 'very big', you could use 'enormous' or 'massive'.")
    - For delivery, comment on specific moments of good or unclear speech.

    **Part 2: Pronunciation Analysis**
    Pronunciation clarity and accuracy are a key part of the 'Delivery' score. In addition to factoring this into the Delivery score, provide separate, detailed feedback on the speaker's pronunciation in the 'pronunciation' field of the JSON. Identify specific words that were mispronounced and provide the correct pronunciation.
    Since the speaker is likely from Turkey, be mindful of common pronunciation challenges for Turkish speakers (e.g., 'w' vs 'v', 'th' sounds, vowel sounds like in 'ship' vs 'sheep').
    
    **Part 3: Transcription**
    Provide a verbatim transcript of the user's speech. This should be a clean text output of everything the user said in the audio.

    **Final Output:**
    Your entire response must be a single JSON object matching the provided schema. The 'topic' field in the JSON MUST be filled, either with the original topic or the one you detected for the freestyle speech.
    **Remember: All text in the JSON feedback MUST be in English.**
  `;
  }
  
  try {
    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: mimeType,
      },
    };
    
    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: evaluationSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as EvaluationResultData;
  } catch (error) {
    console.error("Error evaluating speech with Gemini API:", error);
    throw new Error("Failed to get evaluation from AI. Please try again.");
  }
};