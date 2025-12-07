import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Fallback questions in case API fails or key is missing
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: "fb-1",
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswerIndex: 2,
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    id: "fb-2",
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswerIndex: 1,
    explanation: "Mars is often called the 'Red Planet' due to the reddish iron oxide prevalent on its surface."
  },
  {
    id: "fb-3",
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswerIndex: 1,
    explanation: "William Shakespeare wrote the tragedy 'Romeo and Juliet' early in his career."
  },
  {
    id: "fb-4",
    text: "What is the chemical symbol for Gold?",
    options: ["Au", "Ag", "Fe", "Hg"],
    correctAnswerIndex: 0,
    explanation: "The symbol 'Au' comes from the Latin word for gold, 'aurum'."
  },
  {
    id: "fb-5",
    text: "In which year did the Titanic sink?",
    options: ["1905", "1912", "1918", "1923"],
    correctAnswerIndex: 1,
    explanation: "The RMS Titanic sank in the North Atlantic Ocean on April 15, 1912."
  }
];

export const generateQuizQuestions = async (topic: string, difficulty: string): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  
  // If no API key is present, return fallback questions immediately to prevent crash
  if (!apiKey) {
    console.warn("No API_KEY found in environment. Using fallback questions.");
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    return FALLBACK_QUESTIONS;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Generate 10 multiple-choice quiz questions about "${topic}" at a ${difficulty} difficulty level.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a quiz master. Create engaging, accurate questions. Ensure all options are plausible.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The question text" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "An array of exactly 4 possible answers" 
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "The zero-based index of the correct answer in the options array (0-3)" 
              },
              explanation: { type: Type.STRING, description: "A short explanation of why the answer is correct" }
            },
            required: ["text", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    const rawQuestions = JSON.parse(jsonText);
    
    // Map to our internal Question type and add IDs
    const questions: Question[] = rawQuestions.map((q: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }));

    return questions;

  } catch (error) {
    console.error("Failed to generate quiz:", error);
    // Return fallback on error ensures the app remains "functional"
    return FALLBACK_QUESTIONS;
  }
};
