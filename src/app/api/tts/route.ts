import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripMarkdown } from '@/lib/text-parser';
import { truncateAtSentenceBoundary } from '@/lib/text-parser';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("FATAL: OPENAI_API_KEY environment variable is not set.");
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';
const MAX_INPUT_LENGTH = 4096;

const TtsRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  voice: z.enum(['alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer']).default('nova'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = TtsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { voice } = parsed.data;
    const cleanText = stripMarkdown(parsed.data.text);
    const { text: input } = truncateAtSentenceBoundary(cleanText, MAX_INPUT_LENGTH);

    const response = await fetch(OPENAI_TTS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input,
        voice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('--- OPENAI TTS API ERROR ---', response.status, errorBody);
      return NextResponse.json(
        { error: `OpenAI TTS error (${response.status}): ${errorBody}` },
        { status: 502 }
      );
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('--- TTS ROUTE ERROR ---', message);
    return NextResponse.json(
      { error: `TTS error: ${message}` },
      { status: 500 }
    );
  }
}
