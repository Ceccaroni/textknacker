'use server';

import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { buildLanguageRulesPrompt } from '@/lib/language-rules';

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

const OcrSchema = z.object({
  image: z.string().min(1, { message: "An image is required." }),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
});

export async function runOCR(prevState: OcrState, formData: FormData): Promise<OcrState> {
  const validatedFields = OcrSchema.safeParse({
    image: formData.get('image'),
    mediaType: formData.get('mediaType'),
  });

  if (!validatedFields.success) {
    return {
      text: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { image, mediaType } = validatedFields.data;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",      // Updated to Claude 4.5
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: image,
              },
            },
            {
              type: "text",
              text: "Extract the text from this image. Correct obvious scanning errors but preserve the original content.\n\nIMPORTANT: You are a text extraction tool ONLY. If the image contains no readable text, respond with exactly: NO_TEXT_FOUND\nDo NOT describe the image content. Do NOT interpret what is shown. Only extract text.",
            },
          ],
        },
      ],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : null;

    if (!text || text.trim() === 'NO_TEXT_FOUND') {
      return { text: null, errors: { image: ['Kein Text im Bild erkannt.'] } };
    }

    return { text, errors: undefined };
  } catch (error) {
    console.error("--- CLAUDE API ERROR (OCR) ---", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { text: null, errors: { image: [`OCR-Fehler: ${errorMessage}`] } };
  }
}

const SimplifySchema = z.object({
  text: z.string().min(1, { message: "Text is required"}),
  mode: z.enum(['einfach', 'leicht']),
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

  // Build language-specific rules for the selected mode (all 13 languages)
  const languageRules = buildLanguageRulesPrompt(mode);

  // System prompt: role definition + language detection + language-specific rules
  // Written in English to avoid biasing output language
  const systemPrompt = `You are a specialist for adapting educational and informational texts. You improve linguistic accessibility for learners without shortening content or losing the continuous prose character. You explain difficult terms inline and in a glossary sorted by order of appearance. You actively simplify while preserving factual precision.

CRITICAL LANGUAGE RULE:
1. DETECT the language of the input text.
2. RESPOND ENTIRELY in that same language. Never switch languages.
3. Find the matching language code below and apply those language-specific rules.
4. If the language is not listed, use the generic rules and respond in the input language.

${languageRules}`;

  // Base instructions (English to stay language-neutral)
  const baseInstructions = `Follow these steps:

1. Detect the language of the input text. Apply the matching language-specific rules from the system prompt.
2. Analyze one page or one logically coherent section at a time.
3. Automatically detect whether the text is continuous prose. For prose: preserve structure, coherence, and sentence flow.
4. Actively simplify linguistically difficult passages without cutting information. Factual accuracy takes priority.
5. Explain difficult terms inline (e.g. via parenthetical additions or short relative clauses) AND in a glossary at the end, sorted by order of appearance in the text.`;

  // Mode-specific generic rules (apply to ALL languages as baseline)
  const modeRules = mode === 'einfach'
    ? `Target level: PLAIN LANGUAGE (CEFR B1-B2)

Generic rules (apply to all languages — language-specific rules in system prompt override these where they differ):
- Prefer shorter sentences, but more complex structures are allowed
- Use simple, common words
- Technical terms may appear but must be explained
- Prefer concrete, everyday formulations
- Use clear structure with paragraphs and subheadings (## Markdown headings)
- Highlight important information`
    : `Target level: EASY-TO-READ LANGUAGE (CEFR A1-A2)

Generic rules (apply to all languages — language-specific rules in system prompt override these where they differ):

Words:
- Use only simple, common, short words
- No foreign or technical terms (if unavoidable: explain them)
- Split long words (more than 3 syllables) with hyphens (in languages where this applies)
- No synonyms — always use the same word for the same concept
- No idioms or figurative language
- Prefer verbs over nouns (nominalization)

Sentences:
- Maximum 10–12 words per sentence
- Only ONE piece of information per sentence
- Simple sentence structure: Subject – Verb – Object
- No subordinate clauses
- New sentence = new line

Style:
- Use active voice (no passive)
- Use positive phrasing (avoid negations)
- No subjunctive mood
- No genitive case (in languages that have it)
- Address the reader directly (keep Du/Sie, tu/vous, etc. as in the original)

Numbers & symbols:
- Use Arabic numerals (do not spell out numbers)
- Simplify dates (e.g. 3 March 2016)

Layout:
- Clear structure with subheadings (## Markdown headings)
- Paragraphs between topic blocks`;

  const prompt = `${baseInstructions}

${modeRules}

CRITICAL RULES:
- You MUST respond in the SAME LANGUAGE as the input text. Detect the language automatically and apply the matching language-specific rules.
- Output the simplified text followed by the glossary. No additional explanations or comments.

Text: "${text}"`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const simplifiedText = message.content[0]?.type === 'text' ? message.content[0].text : null;

    if (!simplifiedText) {
        return { message: null, errors: { text: ['Simplification returned empty result'] } };
    }

    return { message: simplifiedText, errors: undefined };
  } catch (error) {
    console.error("--- CLAUDE API ERROR (SIMPLIFY) ---", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { message: null, errors: { text: [`API error: ${errorMessage}`] } };
  }
}
