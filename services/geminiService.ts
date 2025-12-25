import { GoogleGenAI, Type } from "@google/genai";
import { Meal, ShoppingVerdict, UserProfile } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Persona definition for the chat
const SYSTEM_INSTRUCTION = `
You are NutriGPT, a hyper-personalized, fun, and lighthearted AI nutritionist. 
You are supportive, witty, and slightly gamified. 
You talk like a supportive friend, not a strict doctor. 
Use emojis liberally. 
Be scientifically accurate but deliver advice in a "vibe check" format.
Never be judgmental. 
If a user eats something unhealthy, joke about it kindly and suggest a balance for the next meal.
`;

export const chatWithNutriGPT = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview'; // Good for chat
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9, // Creative and fun
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Oops, my brain is buffering! 🧠⚡";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Something went wrong connecting to the nutrition matrix! 🍓";
  }
};

export const analyzeMealImage = async (base64Image: string, userProfile: UserProfile): Promise<Omit<Meal, 'id' | 'timestamp' | 'imageUrl'>> => {
  try {
    const model = 'gemini-2.5-flash-image'; // Optimized for vision

    const prompt = `
    Analyze this food image based on this user profile: 
    Goal: ${userProfile.goal}, Allergies: ${userProfile.allergies.join(', ')}.
    
    Identify the main dish. Estimate calories and macros.
    Give it a "NutriGPT Score" from 1-10 based on healthiness and alignment with the user's goal.
    - 1-3: Unhealthy/Conflict
    - 4-7: Okay/Moderate
    - 8-10: Super Food/Perfect Match
    
    Provide a "vibeCheck" which is a 1-sentence witty comment about the food.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
              }
            },
            score: { type: Type.NUMBER },
            vibeCheck: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No data returned");

  } catch (error) {
    console.error("Meal Analysis Error:", error);
    return {
      name: "Mystery Meal",
      calories: 0,
      macros: { protein: 0, carbs: 0, fat: 0 },
      score: 5,
      vibeCheck: "Couldn't analyze this one, but looks tasty! 😋"
    };
  }
};

export const analyzeShoppingLabel = async (base64Image: string): Promise<ShoppingVerdict> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    const prompt = `
    Analyze this nutrition label or product.
    Give it a score (1-10).
    Verdict: GO (Green), STOP (Red), or CAUTION (Yellow).
    Explanation: A fun, short explanation why.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING, enum: ['GO', 'STOP', 'CAUTION'] },
            explanation: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No data");

  } catch (error) {
    console.error("Label Analysis Error:", error);
    return {
        score: 0,
        verdict: 'CAUTION',
        explanation: "I couldn't read that label clearly! 🕵️‍♀️"
    };
  }
};
