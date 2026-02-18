# PHORO Read Blueprint

## Overview

"PHORO Read" (formerly "Textknacker") is a web application designed to simplify german texts using AI. It offers a streamlined, single-view user experience for text input (either typed or from a camera) and a reading mode for the simplified output, with various accessibility features.

## Project Outline

### Tech Stack
*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **UI:** Tailwind CSS, ShadCN UI
*   **Icons:** Lucide Icons
*   **Backend:** Genkit (Google AI SDK) via Server Actions
*   **PDF Generation:** jsPDF

### Design & UX
*   **Font:** Lexend (Google Fonts) will be used throughout the application.
*   **Layout:** A single-view, linear step-flow.
*   **State A (Input):**
    *   Tabs: "Camera" and "Type Text".
    *   Camera View: Live video feed with a "Take Photo" button. `playsinline` attribute will be used for the video element to ensure correct behavior on iOS.
    *   Text View: Large textarea.
    *   Action Button: "Text knacken".
*   **State B (Reading Mode):**
    *   Header: "Back" arrow.
    *   Content: Simplified text.
    *   Sticky Toolbar:
        *   **Level-Switch:** Toggle between "Text" (easy language, full sentences) and "Liste" (radically simplified bullet points).
        *   **Text-to-Speech (TTS):** Play/Pause functionality.
        *   **Focus Mode:** Click a sentence to highlight it in yellow, greying out the rest.
        *   **Spacing:** A button to increase letter spacing.
        *   **PDF:** A "Save as PDF" button.

### AI Specification (Genkit)
*   **Location:** `src/app/actions.ts`
*   **Flow 1 (OCR):**
    *   **Prompt:** "Extract text. Correct scanning errors."
*   **Flow 2 (Simplification):**
    *   **Input:** `text` and `mode` ('text' | 'list').
    *   **Prompt ('text' mode):** "Write in Easy Language (A2 level). Use complete sentences."
    *   **Prompt ('list' mode):** "Summarize the content in extremely simple bullet points. No long sentences."

## Current Plan: Initial Setup & Phase 1 Deployment

*   [x] Initialize Next.js project.
*   [x] Install and configure ShadCN UI with `button`, `textarea`, `tabs`, `toggle-group`.
*   [x] Install `lucide-react` and `jspdf`.
*   [x] Install `genkit` and `@google-cloud/vertexai` for AI functionality.
*   [x] Create `firebase.json` for classic hosting.
*   [x] Deploy an empty skeleton to Firebase Hosting to secure the URL.
*   **Next:** Wait for user confirmation ("Deploy complete") before proceeding with view implementation.
