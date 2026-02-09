'use server';

import { z } from 'zod';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// --- FIX: Explicitly initialize with the API key ---
// The connection was failing because the key was not explicitly passed.
if (!process.env.GEMINI_API_KEY) {
    throw new Error("FATAL: GEMINI_API_KEY environment variable is not set.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// -----------------------------------------------------

// Define strict state types
export type OcrState = {
  text: string | null;
  errors?: {
    image?: string[];
  };
};

export type SimplifyState = {
  message: string | null;
  errors?: {
    text?: string[];
    mode?: string[];
  };
};

const generativeModel = genAI.getGenerativeModel({ model: "gemini-pro" });

const OcrSchema = z.object({
  image: z.string().min(1, { message: "An image is required." }),
});

export async function runOCR(prevState: OcrState, formData: FormData): Promise<OcrState> {
  const validatedFields = OcrSchema.safeParse({
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      text: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { image } = validatedFields.data;

  const imagePart: Part = {
    inlineData: { data: image, mimeType: 'image/jpeg' },
  };

  const textPart: Part = {
      text: "Extract the text from this image. Correct obvious scanning errors but preserve the original content.",
  };

  try {
    const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: [textPart, imagePart] }] });
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { text: null, errors: { image: ['Could not extract text from image.'] } };
    }

    return { text, errors: undefined }; // Success
  } catch (error) {
    console.error("--- GEMINI API ERROR ---", error);
    return { text: null, errors: { image: ['Server error: Failed to connect to Gemini API.'] } };
  }
}

const SimplifySchema = z.object({
  text: z.string().min(1, { message: "Text is required"}),
  mode: z.enum(['text', 'list']),
});

export async function simplifyText(prevState: SimplifyState, formData: FormData): Promise<SimplifyState> {
  const validatedFields = SimplifySchema.safeParse({
    text: formData.get('text'),
    mode: formData.get('mode'),
  });

  if (!validatedFields.success) {
    return {
      message: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { text, mode } = validatedFields.data;

  const prompt = mode === 'text'
    ? `Rewrite the following text in simple language (A2 level). Use complete sentences.\n\nText: "${text}"`
    : `Summarize the following content in extremely simple bullet points. No long sentences.\n\nContent: "${text}"`;

  try {
    const simplifiedText = (await generativeModel.generateContent(prompt)).response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!simplifiedText) {
        return { message: "Could not simplify text", errors: undefined };
    }

    return { message: simplifiedText, errors: undefined }; // Success
  } catch (error) {
    console.error("--- GEMINI API ERROR (SIMPLIFY) ---", error);
    return { message: "Error during text simplification.", errors: { text: ["Server error during simplification."] } };
  }
}
