'use client';

import { useState, useRef, useEffect, useMemo, ChangeEvent } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { runOCR, simplifyText, OcrState, SimplifyState } from './actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import {
  Camera, LoaderCircle, Sparkles, X,
  ArrowLeft, Play, Pause, Type, Crosshair, FileDown,
} from 'lucide-react';

// ── Initial States ──────────────────────────────────────────────

const ocrInitialState: OcrState = { text: null, errors: undefined };
const simplifyInitialState: SimplifyState = { message: null, errors: undefined };

// ── Sub-Components ──────────────────────────────────────────────

function OcrFormContent() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="flex flex-col items-center text-white">
            <LoaderCircle className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-lg font-semibold">Text wird erkannt...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Button type="submit" size="lg" className="rounded-full h-16 w-16 shadow-lg" disabled={pending}>
          <Camera className="h-8 w-8" />
        </Button>
      </div>
    </>
  );
}

function SimplifySubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="h-5 w-5 animate-spin" />}
      Vereinfachen
    </Button>
  );
}

// ── Main Component ──────────────────────────────────────────────

export default function Home() {
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Server action states
  const [simplifyState, simplifyFormAction] = useActionState(simplifyText, simplifyInitialState);
  const [ocrState, ocrFormAction] = useActionState(runOCR, ocrInitialState);

  // Input view state
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // View state
  const [view, setView] = useState<'input' | 'reading'>('input');

  // Reading mode state
  const [readingMode, setReadingMode] = useState<'einfach' | 'leicht'>('einfach');
  const [resultCache, setResultCache] = useState<{ einfach: string | null; leicht: string | null }>({ einfach: null, leicht: null });
  const [originalText, setOriginalText] = useState('');
  const [isModeSwitching, setIsModeSwitching] = useState(false);

  // Toolbar feature states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [wideSpacing, setWideSpacing] = useState(false);

  // ── Camera Setup ────────────────────────────────────────────

  useEffect(() => {
    async function setupCamera() {
      setCameraError(null);
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } else {
          setCameraError('Dein Browser unterstützt keinen Kamerazugriff.');
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          setCameraError('Kamerazugriff wurde verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.');
        } else {
          setCameraError('Kamera konnte nicht gestartet werden. Wird sie von einer anderen App verwendet?');
        }
      }
    }

    if (activeTab === 'camera' && view === 'input') setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [activeTab, view]);

  // ── OCR Result → Text Tab ───────────────────────────────────

  useEffect(() => {
    if (ocrState.text) {
      setText(ocrState.text);
      setActiveTab('text');
    }
  }, [ocrState.text]);

  // ── Simplification Result → Reading Mode ────────────────────

  useEffect(() => {
    if (simplifyState?.message && !simplifyState?.errors) {
      setOriginalText(text);
      setResultCache({ einfach: simplifyState.message, leicht: null });
      setReadingMode('einfach');
      setView('reading');
    }
  }, [simplifyState]);

  // ── TTS Voice Loading ───────────────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── Camera Capture ──────────────────────────────────────────

  const captureAndSubmit = (formData: FormData) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        formData.set('image', canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
        ocrFormAction(formData);
      }
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string)?.split(',')[1];
      if (base64) {
        const fd = new FormData();
        fd.set('image', base64);
        ocrFormAction(fd);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Reading Mode: Mode Switch with Cache ────────────────────

  async function switchMode(newMode: 'einfach' | 'leicht') {
    if (newMode === readingMode) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setFocusedIndex(null);

    if (resultCache[newMode]) {
      setReadingMode(newMode);
      return;
    }

    setIsModeSwitching(true);
    const fd = new FormData();
    fd.set('text', originalText);
    fd.set('mode', newMode);

    const result = await simplifyText(simplifyInitialState, fd);
    if (result.message) {
      setResultCache(prev => ({ ...prev, [newMode]: result.message }));
      setReadingMode(newMode);
    }
    setIsModeSwitching(false);
  }

  // ── Reading Mode: Back ──────────────────────────────────────

  function handleBack() {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setFocusModeActive(false);
    setFocusedIndex(null);
    setWideSpacing(false);
    setView('input');
  }

  // ── Reading Mode: TTS ──────────────────────────────────────

  function toggleTTS() {
    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const currentText = resultCache[readingMode] || '';
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;

    const voices = synth.getVoices();
    const germanVoice = voices.find(v => v.lang.startsWith('de'));
    if (germanVoice) utterance.voice = germanVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
    setIsSpeaking(true);
  }

  // ── Reading Mode: PDF Export ────────────────────────────────

  async function handlePdfExport() {
    const jsPDFModule = await import('jspdf');
    const doc = new jsPDFModule.default({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const currentText = resultCache[readingMode] || '';
    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;

    doc.setFontSize(18);
    doc.text('PHORO Read', margin, margin);

    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(readingMode === 'einfach' ? 'Einfache Sprache' : 'Leichte Sprache', margin, margin + 8);

    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(currentText, maxWidth);
    doc.text(lines, margin, margin + 18);

    doc.save('phoro-read.pdf');
  }

  // ── Reading Mode: Block Parsing ─────────────────────────────

  const currentText = resultCache[readingMode] || '';

  type TextBlock = { type: 'heading'; text: string } | { type: 'paragraph'; sentences: string[] };

  function parseHeading(line: string): string | null {
    const md = line.match(/^#{1,3}\s+(.+)$/);
    if (md) return md[1];
    const bold = line.match(/^\*\*(.+)\*\*$/);
    if (bold) return bold[1];
    return null;
  }

  const textBlocks = useMemo((): TextBlock[] => {
    if (!currentText) return [];
    return currentText.split(/\n\n+/).filter(b => b.trim()).map(block => {
      const trimmed = block.trim();
      const heading = parseHeading(trimmed);
      if (heading) return { type: 'heading', text: heading };
      const sentences = trimmed.match(/[^.!?]*[.!?]+[\s]?|[^.!?]+$/g)?.filter(s => s.trim()) || [trimmed];
      return { type: 'paragraph', sentences };
    });
  }, [currentText]);

  // ── Render ──────────────────────────────────────────────────

  return (
    <main className="h-dvh flex flex-col bg-phoro-warmbeige">

      {/* ── Desktop Header (full width, outside max-w container) ── */}
      <header className="hidden md:flex px-4 pt-4 pb-2 border-b border-phoro-slate/15 bg-[#EAE6DF] flex-col items-center shrink-0">
        <div className="flex items-end gap-1.5">
          <img src="/logo-phoro.svg" alt="PHORO" className="h-10" />
          <span className="text-phoro-morgenrot text-lg font-light tracking-wide mb-2">read</span>
        </div>
        <p className="text-center text-phoro-slate/60 mt-1 text-sm">Gib mir einen Text – ich kümmere mich um den Rest.</p>
      </header>

      <div className="flex-1 flex flex-col md:flex-row md:items-stretch overflow-hidden w-full max-w-2xl md:max-w-6xl mx-auto">

          {/* ════════════════ LEFT PANEL: INPUT ════════════════ */}
          {/* Mobile: hidden when reading. Desktop: always visible. */}
          <div className={cn(
            "flex-1 flex flex-col overflow-hidden",
            "md:w-1/2 md:self-stretch",
            view === 'reading' && "max-md:hidden"
          )}>
            {/* Mobile-only Input Header */}
            <header className="md:hidden px-4 pt-4 pb-2 border-b border-phoro-slate/15 bg-[#EAE6DF] flex flex-col items-center shrink-0">
              <div className="flex items-end gap-1.5">
                <img src="/logo-phoro.svg" alt="PHORO" className="h-10" />
                <span className="text-phoro-morgenrot text-lg font-light tracking-wide mb-2">read</span>
              </div>
              <p className="text-center text-phoro-slate/60 mt-1 text-sm">Gib mir einen Text – ich kümmere mich um den Rest.</p>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
              <TabsList className="grid w-full grid-cols-2 shrink-0">
                <TabsTrigger value="camera">Kamera</TabsTrigger>
                <TabsTrigger value="text">Text eingeben</TabsTrigger>
              </TabsList>

              {/* ── Camera Tab ── */}
              <TabsContent value="camera" className="flex-1 flex flex-col overflow-y-auto">
                <form action={captureAndSubmit} className="flex-1 flex flex-col min-h-0">
                  <div className="relative flex-1 min-h-[12rem] bg-black rounded-lg overflow-hidden shadow-lg">
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                    <OcrFormContent />
                  </div>
                </form>

                <div className="mt-3 text-center shrink-0">
                  {cameraError && <p className="text-sm text-red-600 mb-2">{cameraError}</p>}
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer text-sm text-phoro-slate/60">
                      Kamera funktioniert nicht?{' '}
                      <span className="font-semibold text-phoro-blue hover:underline">Bild hochladen.</span>
                    </label>
                    <input id="file-upload" type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                  </div>
                </div>

                {ocrState.errors?.image && (
                  <div className="mt-2 p-2 text-center text-red-500 shrink-0">
                    <p>{ocrState.errors.image[0]}</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </TabsContent>

              {/* ── Text Tab ── */}
              <TabsContent value="text" className="flex-1 flex flex-col overflow-hidden gap-4">
                <form action={simplifyFormAction} className="flex-1 flex flex-col gap-4 min-h-0">
                  <div className="relative flex-1 min-h-0">
                    <Textarea
                      name="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Hier Text reinkopieren oder Datei reinziehen."
                      className="w-full h-full min-h-[8rem] resize-none text-lg"
                    />
                    {text && (
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setText('')}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="shrink-0">
                    <input type="hidden" name="mode" value="einfach" />
                    <SimplifySubmitButton />
                    {simplifyState?.errors?.text && (
                      <div className="p-2 text-center text-red-500">
                        <p>{simplifyState.errors.text[0]}</p>
                      </div>
                    )}
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* ════════════════ RIGHT PANEL: RESULTS ════════════════ */}
          {/* Mobile: hidden when input. Desktop: always visible. */}
          <div className={cn(
            "flex-1 flex flex-col overflow-hidden",
            "md:w-1/2 md:self-stretch",
            view === 'input' && "max-md:hidden"
          )}>
            {/* Mobile-only Reading Header */}
            <header className="md:hidden px-4 py-3 border-b border-phoro-slate/15 bg-[#EAE6DF] flex items-center shrink-0">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-end gap-1 mx-auto">
                <img src="/logo-phoro.svg" alt="PHORO" className="h-8" />
                <span className="text-phoro-morgenrot text-base font-light tracking-wide mb-1.5">read</span>
              </div>
              <div className="w-9" />
            </header>

            {/* ── Right panel content: mirrors left panel structure ── */}
            <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
              {/* Top: Level Switch or spacer (mirrors TabsList height) */}
              {(currentText || isModeSwitching) ? (
                <div className="shrink-0">
                  <div className="flex rounded-[6px] border border-phoro-slate/20 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => switchMode('einfach')}
                      disabled={isModeSwitching}
                      className={cn(
                        "flex-1 flex flex-col items-center py-2 transition-colors disabled:opacity-50",
                        readingMode === 'einfach'
                          ? "bg-phoro-blue text-white"
                          : "text-phoro-slate hover:bg-phoro-blue/5"
                      )}
                    >
                      <span className="text-sm font-medium">Einfach</span>
                      <span className={cn(
                        "text-[11px]",
                        readingMode === 'einfach' ? "text-white/60" : "text-phoro-slate/50"
                      )}>B1 – B2</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('leicht')}
                      disabled={isModeSwitching}
                      className={cn(
                        "flex-1 flex flex-col items-center py-2 transition-colors disabled:opacity-50",
                        readingMode === 'leicht'
                          ? "bg-phoro-blue text-white"
                          : "text-phoro-slate hover:bg-phoro-blue/5"
                      )}
                    >
                      <span className="text-sm font-medium">Leicht</span>
                      <span className={cn(
                        "text-[11px]",
                        readingMode === 'leicht' ? "text-white/60" : "text-phoro-slate/50"
                      )}>A1 – A2</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="shrink-0 h-9" />
              )}

              {/* Center: Result box (matches textarea size) */}
              <div className="relative flex-1 min-h-0">
                <div className={cn(
                  "w-full h-full rounded-md border border-input overflow-y-auto p-4",
                  "text-lg leading-relaxed text-phoro-blue",
                  wideSpacing && "tracking-[0.12em] leading-loose"
                )}>
                  {isModeSwitching ? (
                    <div className="flex items-center justify-center h-full">
                      <LoaderCircle className="h-8 w-8 animate-spin text-phoro-slate/50" />
                      <span className="ml-3 text-phoro-slate/60">Wird vereinfacht...</span>
                    </div>
                  ) : currentText ? (
                    <div>
                      {(() => {
                        let sentIdx = 0;
                        return textBlocks.map((block, blockI) => {
                          if (block.type === 'heading') {
                            return <h3 key={blockI} className="font-bold text-xl mt-6 first:mt-0 mb-2">{block.text}</h3>;
                          }
                          return (
                            <p key={blockI} className="mb-4 last:mb-0">
                              {block.sentences.map((sentence, si) => {
                                const idx = sentIdx++;
                                return (
                                  <span
                                    key={si}
                                    onClick={() => focusModeActive && setFocusedIndex(focusedIndex === idx ? null : idx)}
                                    className={cn(
                                      "transition-all",
                                      focusModeActive && "cursor-pointer",
                                      focusModeActive && focusedIndex !== null && focusedIndex !== idx && "opacity-20",
                                      focusModeActive && focusedIndex === idx && "bg-phoro-green/10 rounded px-0.5",
                                    )}
                                  >
                                    {sentence}
                                  </span>
                                );
                              })}
                            </p>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-phoro-slate/40 text-sm">Ergebnis erscheint hier.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom: Action buttons or spacer (mirrors "Vereinfachen" button position) */}
              {(currentText || isModeSwitching) ? (
                <div className="shrink-0">
                  <div className="flex gap-2">
                    <Button
                      variant={isSpeaking ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={toggleTTS}
                    >
                      {isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isSpeaking ? 'Pause' : 'Vorlesen'}
                    </Button>

                    <Button
                      variant={focusModeActive ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => { setFocusModeActive(!focusModeActive); setFocusedIndex(null); }}
                    >
                      <Crosshair className="h-4 w-4" />
                      Fokus
                    </Button>

                    <Button
                      variant={wideSpacing ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setWideSpacing(!wideSpacing)}
                    >
                      <Type className="h-4 w-4" />
                      Abstand
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={handlePdfExport}
                    >
                      <FileDown className="h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="shrink-0 h-9" />
              )}
            </div>
          </div>

      </div>
    </main>
  );
}
