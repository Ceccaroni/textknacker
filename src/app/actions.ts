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

  // System prompt: Rolle (für beide Modi gleich)
  const systemPrompt = `Du bist ein Analytiker für didaktische Materialien, der darauf spezialisiert ist, Sach- und Fliesstexte zu überarbeiten. Du hilfst dabei, die sprachliche Verständlichkeit für Schüler:innen zu verbessern, ohne den Inhalt zu kürzen oder den Fliesstextcharakter zu verlieren. Du erklärst schwierige Begriffe im Text und zusätzlich in einem Glossar, das nach Vorkommen sortiert ist. Du vereinfachst aktiv, ohne fachliche Präzision zu verlieren.`;

  // Basis-Instruktionen (für beide Modi gleich)
  const baseInstructions = `Folge diesen Schritten:

1. Analysiere jeweils nur eine Seite oder logisch zusammenhängende Abschnitte.
2. Erkenne automatisch, ob es sich um einen Fliesstext handelt. Bei Fliesstexten: Erhalte Struktur, Kohärenz und Satzfluss.
3. Vereinfache aktiv sprachlich schwierige Stellen, ohne Informationen zu kürzen. Fachliche Genauigkeit hat Priorität.
4. Erkläre schwierige Begriffe direkt im Text (z.B. durch Klammerergänzungen oder kurze Nebensätze) und zusätzlich in einem Glossar am Ende, das nach Vorkommen im Text sortiert ist.`;

  // Modus-spezifische Regeln
  const modeRules = mode === 'einfach'
    ? `Zielniveau: EINFACHE SPRACHE (B1-B2)

Regeln:
- Kürzere Sätze bevorzugen, aber komplexere Strukturen sind erlaubt
- Einfache, bekannte Wörter verwenden
- Fachbegriffe dürfen vorkommen, müssen aber erklärt werden
- Konkrete, alltagsnahe Formulierungen bevorzugen
- Übersichtliche Gliederung mit Absätzen und Zwischentiteln (## Markdown-Headings)
- Wichtige Informationen hervorheben`
    : `Zielniveau: LEICHTE SPRACHE (A1-A2)

Strikte Regeln — halte dich an ALLE:

Wörter:
- Nur einfache, bekannte, kurze Wörter
- Keine Fremd- und Fachwörter (wenn nötig: erklären)
- Lange Wörter (mehr als 3 Silben) mit Binde-Strich trennen
- Keine Synonyme — immer das gleiche Wort für die gleiche Sache
- Keine Redewendungen oder bildhafte Sprache
- Verben statt Hauptwörter verwenden

Sätze:
- Maximal 10–12 Wörter pro Satz
- Pro Satz nur EINE Information
- Einfacher Satzbau: Subjekt – Verb – Objekt
- Keine Nebensätze
- Neuer Satz = neue Zeile

Stil:
- Aktiv formulieren (kein Passiv)
- Positiv formulieren (keine Verneinungen)
- Kein Konjunktiv
- Kein Genitiv
- Leser persönlich ansprechen (Du/Sie beibehalten)

Zahlen & Zeichen:
- Arabische Zahlen verwenden (nicht ausschreiben)
- Datum vereinfachen (z.B. 3. März 2016)

Layout:
- Übersichtliche Gliederung mit Zwischen-Titeln (## Markdown-Headings)
- Absätze zwischen Themen-Blöcken`;

  const prompt = `${baseInstructions}

${modeRules}

WICHTIG:
- Antworte IMMER in der gleichen Sprache wie der Eingabetext.
- Bei deutschen Texten: Verwende IMMER Schweizer Rechtschreibung (ss statt ß, z.B. «strasse» statt «straße», «gruss» statt «gruß»).
- Gib den vereinfachten Text aus, gefolgt vom Glossar. Keine weiteren Erklärungen oder Kommentare.

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
        return { message: "Could not simplify text", errors: undefined };
    }

    return { message: simplifiedText, errors: undefined };
  } catch (error) {
    console.error("--- CLAUDE API ERROR (SIMPLIFY) ---", error);
    return { message: "Error during text simplification.", errors: { text: ["Server error during simplification."] } };
  }
}
