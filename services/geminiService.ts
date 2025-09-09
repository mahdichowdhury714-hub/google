import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const base64ToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data.split(',')[1],
      mimeType,
    },
  };
};

export const changeBackground = async (imageBase64: string, backgroundColor: string): Promise<string> => {
  try {
    const imagePart = base64ToGenerativePart(imageBase64, 'image/jpeg');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          imagePart,
          { text: `Analyze the image and identify the main person. Create a new image where this person is perfectly isolated and placed on a solid background with the hex color ${backgroundColor}. Ensure the person is fully opaque and the background is a single, solid color. Nothing from the original background should be visible.` },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error('No image part found in Gemini API response.');
  } catch (error) {
    console.error("Error calling Gemini API for background change:", error);
    throw new Error("Failed to change background. Please try again.");
  }
};