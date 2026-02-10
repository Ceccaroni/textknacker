'use server';

import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("FATAL: ANTHROPIC_API_KEY environment variable is not set.");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: image,
              },
            },
            {
              type: "text",
              text: "Extract the text from this image. Correct obvious scanning errors but preserve the original content.",
            },
          ],
        },
      ],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : null;

    if (!text) {
      return { text: null, errors: { image: ['Could not extract text from image.'] } };
    }

    return { text, errors: undefined };
  } catch (error) {
    console.error("--- CLAUDE API ERROR (OCR) ---", error);
    return { text: null, errors: { image: ['Server error: Failed to connect to Claude API.'] } };
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
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const simplifiedText = message.content[0]?.type === 'text' ? message.content[0].text : null;

    if (!simplifiedText) {
        return { message: "Could not simplify text", errors: undefined };
    }

    return { message: simplifiedText, errors: undefined };
  } catch (error) {
    console.error("--- CLAUDE API ERROR (SIMPLIFY) ---", error);
    return { message: "Error during text simplification.", errors: { text: ["Server error during simplification."] } };
  }
}
