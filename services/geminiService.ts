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

export const evaluateSpeech = async (audioBase64: string, mimeType: string, topic: string, allTopics: string[]): Promise<EvaluationResultData> => {
  const isFreestyle = topic.toLowerCase().includes('freestyle') || topic.toLowerCase().includes('serbest');
  
  const prompt = `
    You are an expert English speaking evaluator, specializing in coaching non-native speakers. The user is likely an English learner from Turkey.
    I will provide you with an audio recording of this person speaking on a given topic.
    Your task is to analyze the speech and provide a detailed, highly actionable evaluation in JSON format.

    ${isFreestyle ? `
    **Part 0: Topic Detection**
    The user chose to do a "Freestyle" speech. Before evaluating, you MUST first analyze the user's speech and determine which of the following predefined topics is the most relevant match.
    
    Available Topics: ${JSON.stringify(allTopics)}

    Select the single best-matching topic from that list. This detected topic MUST be used as the 'topic' in your final JSON response. All evaluation should then proceed as if the user was speaking on this detected topic. If no topic is a good match, you can select 'Freestyle (Talk about any topic you want)'.
    ` : `Topic: "${topic}"`}

    **Part 1: Scoring & Feedback**
    Evaluate the speaker based on the following five criteria, each on a scale of 1 to 5 (1=Needs Significant Improvement, 5=Excellent):
    1.  **Rapport**: How well the speaker connects with the listener. Their tone, engagement, and confidence.
    2.  **Organisation**: The logical structure and coherence of their speech. Are ideas presented clearly?
    3.  **Delivery**: The clarity, pace, and intonation. Is the speaker easy to understand?
    4.  **Language Use**: The richness of vocabulary and correctness of grammar.
    5.  **Creativity**: The originality of their thoughts and expression.

    Based on these five criteria scores, also provide an overall score out of 100.

    For each of the five criteria, provide actionable feedback with specific examples.
    - If grammar was weak, give an example from their speech and show the corrected version. (e.g., "You said 'I go yesterday', it should be 'I went yesterday'.")
    - If vocabulary could be better, suggest alternative words. (e.g., "Instead of 'very big', you could use 'enormous' or 'massive'.")
    - For delivery, comment on specific moments of good or unclear speech.

    **Part 2: Pronunciation Analysis (Feedback Only)**
    In addition to the scored criteria, provide a separate analysis of the speaker's pronunciation. This part is for feedback only. It is NOT a scored criterion and it should NOT influence the scores of the five main criteria or the overall score in any way.
    
    Pay close attention to pronunciation. Identify specific words that were mispronounced. Provide the mispronounced word and the correct pronunciation.
    Since the speaker is likely from Turkey, be mindful of common pronunciation challenges for Turkish speakers (e.g., 'w' vs 'v', 'th' sounds, vowel sounds like in 'ship' vs 'sheep'). Structure this feedback in a dedicated "pronunciation" section of the JSON.
    
    **Part 3: Transcription**
    Provide a verbatim transcript of the user's speech. This should be a clean text output of everything the user said in the audio.

    **Final Output:**
    Your entire response must be a single JSON object matching the provided schema. The 'topic' field in the JSON MUST be filled, either with the original topic or the one you detected for the freestyle speech.
  `;

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