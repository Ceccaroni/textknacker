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
  Camera, LoaderCircle, X,
  ArrowLeft, Play, Pause, Type, Crosshair, FileDown, ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { parseTextBlocks, type TextBlock } from '@/lib/text-parser';
import { exportPdf, exportDocx, exportMarkdown, exportPlainText, type ExportParams } from '@/lib/export';
import { ImageEditor } from '@/components/image-editor';

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
  const ocrFormRef = useRef<HTMLFormElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  // Server action states
  const [simplifyState, simplifyFormAction] = useActionState(simplifyText, simplifyInitialState);
  const [ocrState, ocrFormAction] = useActionState(runOCR, ocrInitialState);

  // Input view state
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEditorProcessing, setIsEditorProcessing] = useState(false);

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
    // Stop camera when image editor is open
    if (capturedImage) {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

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
  }, [activeTab, view, capturedImage]);

  // ── OCR Result → Text Tab ───────────────────────────────────

  useEffect(() => {
    if (ocrState.text) {
      setCapturedImage(null);
      setIsEditorProcessing(false);
      setText(ocrState.text);
      setActiveTab('text');
    }
    if (ocrState.errors) {
      setIsEditorProcessing(false);
      // Don't close editor on error — user can retry or cancel
    }
  }, [ocrState]);

  // ── Simplification Result → Reading Mode ────────────────────

  useEffect(() => {
    if (simplifyState?.message && !simplifyState?.errors) {
      setOriginalText(text);
      setResultCache({ einfach: simplifyState.message, leicht: null });
      setReadingMode('einfach');
      setView('reading');
    }
  }, [simplifyState]);

  // ── TTS Audio Refs ─────────────────────────────────────────

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  // ── Camera Capture ──────────────────────────────────────────

  const captureAndSubmit = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
      }
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCapturedImage(dataUrl);
        setActiveTab('camera');
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Image Editor Handlers ──────────────────────────────────

  const handleEditorConfirm = (editedBase64: string, mediaType: string) => {
    setIsEditorProcessing(true);
    if (ocrInputRef.current && ocrFormRef.current) {
      ocrInputRef.current.value = editedBase64;
      const mtInput = ocrFormRef.current.querySelector<HTMLInputElement>('input[name="mediaType"]');
      if (mtInput) mtInput.value = mediaType;
      ocrFormRef.current.requestSubmit();
    }
  };

  const handleEditorCancel = () => {
    setCapturedImage(null);
  };

  // ── Reading Mode: Mode Switch with Cache ────────────────────

  async function switchMode(newMode: 'einfach' | 'leicht') {
    if (newMode === readingMode) return;

    stopAudio();
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
    stopAudio();
    setFocusModeActive(false);
    setFocusedIndex(null);
    setWideSpacing(false);
    setView('input');
  }

  // ── Reading Mode: TTS (OpenAI) ─────────────────────────────

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
    setIsSpeaking(false);
    setIsAudioPaused(false);
  }

  async function toggleTTS() {
    // Currently playing → pause
    if (isSpeaking && !isAudioPaused) {
      audioRef.current?.pause();
      setIsAudioPaused(true);
      return;
    }
    // Currently paused → resume
    if (isSpeaking && isAudioPaused) {
      audioRef.current?.play();
      setIsAudioPaused(false);
      return;
    }
    // Not playing → fetch and play
    const textToSpeak = resultCache[readingMode] || '';
    if (!textToSpeak) return;

    setIsAudioLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Clean up previous audio
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
      }
      audioBlobUrlRef.current = url;

      const audio = new Audio(url);
      audio.onended = () => { setIsSpeaking(false); setIsAudioPaused(false); };
      audio.onerror = () => { setIsSpeaking(false); setIsAudioPaused(false); };
      audioRef.current = audio;
      await audio.play();
      setIsSpeaking(true);
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    } finally {
      setIsAudioLoading(false);
    }
  }

  // ── Reading Mode: Block Parsing ─────────────────────────────

  const currentText = resultCache[readingMode] || '';

  function renderInlineMarkdown(text: string): React.ReactNode[] {
    const result: React.ReactNode[] = [];
    const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) result.push(text.slice(lastIndex, match.index));
      if (match[2]) result.push(<strong key={`md-${key}`}><em>{match[2]}</em></strong>);
      else if (match[3]) result.push(<strong key={`md-${key}`}>{match[3]}</strong>);
      else if (match[4]) result.push(<em key={`md-${key}`}>{match[4]}</em>);
      key++;
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) result.push(text.slice(lastIndex));
    return result.length > 0 ? result : [text];
  }

  const textBlocks = useMemo(() => parseTextBlocks(currentText), [currentText]);

  // ── Export Handler ──────────────────────────────────────────

  function handleExport(format: 'pdf' | 'docx' | 'md' | 'txt') {
    const params: ExportParams = { textBlocks, currentText, readingMode };
    switch (format) {
      case 'pdf': exportPdf(params); break;
      case 'docx': exportDocx(params); break;
      case 'md': exportMarkdown(params); break;
      case 'txt': exportPlainText(params); break;
    }
  }

  // ── Render ──────────────────────────────────────────────────

  return (
    <main className="h-dvh flex flex-col bg-phoro-warmbeige">

      {/* ── Desktop Header (full width, outside max-w container) ── */}
      <header className="hidden md:flex px-4 pt-4 pb-2 border-b border-phoro-slate/15 bg-[#EAE6DF] flex-col items-center shrink-0">
        <div className="flex items-end gap-1.5">
          <img src="/logo-phoro.svg" alt="PHORO" className="h-10" />
          <span className="text-phoro-morgenrot text-lg font-light tracking-wide mb-2">read</span>
        </div>
        <p className="text-center text-phoro-slate/60 mt-1 text-sm">Gib mir einen Text – ich mache den Rest.</p>
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
              <p className="text-center text-phoro-slate/60 mt-1 text-sm">Gib mir einen Text – ich mache den Rest.</p>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
              <TabsList className="grid w-full grid-cols-2 shrink-0">
                <TabsTrigger value="camera">Kamera</TabsTrigger>
                <TabsTrigger value="text">Text eingeben</TabsTrigger>
              </TabsList>

              {/* ── Camera Tab ── */}
              <TabsContent value="camera" className="flex-1 flex flex-col overflow-y-auto">
                {capturedImage ? (
                  <>
                    <ImageEditor
                      imageDataUrl={capturedImage}
                      isProcessing={isEditorProcessing}
                      errorMessage={ocrState.errors?.image?.[0]}
                      onConfirm={handleEditorConfirm}
                      onCancel={handleEditorCancel}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
                <form ref={ocrFormRef} action={ocrFormAction} className="hidden">
                  <input ref={ocrInputRef} type="hidden" name="image" />
                  <input type="hidden" name="mediaType" value="image/jpeg" />
                </form>
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
                  <div className="flex h-9 rounded-[6px] border border-phoro-slate/20 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => switchMode('einfach')}
                      disabled={isModeSwitching}
                      className={cn(
                        "flex-1 flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-50",
                        readingMode === 'einfach'
                          ? "bg-phoro-blue text-white"
                          : "text-phoro-slate hover:bg-phoro-blue/5"
                      )}
                    >
                      Einfache Sprache
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('leicht')}
                      disabled={isModeSwitching}
                      className={cn(
                        "flex-1 flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-50",
                        readingMode === 'leicht'
                          ? "bg-phoro-blue text-white"
                          : "text-phoro-slate hover:bg-phoro-blue/5"
                      )}
                    >
                      Leichte Sprache
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
                          if (block.type === 'separator') {
                            return <hr key={blockI} className="my-4 border-phoro-slate/20" />;
                          }
                          if (block.type === 'heading') {
                            return <h3 key={blockI} className="font-bold text-xl mt-6 first:mt-0 mb-2">{renderInlineMarkdown(block.text)}</h3>;
                          }
                          if (block.type === 'list') {
                            const Tag = block.ordered ? 'ol' : 'ul';
                            return (
                              <Tag key={blockI} className={cn("mb-4 last:mb-0 pl-6", block.ordered ? "list-decimal" : "list-disc")}>
                                {block.items.map((item, i) => (
                                  <li key={i} className="mb-1">{renderInlineMarkdown(item)}</li>
                                ))}
                              </Tag>
                            );
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
                                    {renderInlineMarkdown(sentence)}
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
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant={isSpeaking ? 'default' : 'outline'}
                      size="sm"
                      className="min-w-0 gap-1.5"
                      onClick={toggleTTS}
                      disabled={isAudioLoading}
                    >
                      {isAudioLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : isSpeaking && !isAudioPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isAudioLoading ? 'Laden...' : isSpeaking && !isAudioPaused ? 'Pause' : 'Vorlesen'}
                    </Button>

                    <Button
                      variant={focusModeActive ? 'default' : 'outline'}
                      size="sm"
                      className="min-w-0 gap-1.5"
                      onClick={() => { setFocusModeActive(!focusModeActive); setFocusedIndex(null); }}
                    >
                      <Crosshair className="h-4 w-4" />
                      Fokus
                    </Button>

                    <Button
                      variant={wideSpacing ? 'default' : 'outline'}
                      size="sm"
                      className="min-w-0 gap-1.5"
                      onClick={() => setWideSpacing(!wideSpacing)}
                    >
                      <Type className="h-4 w-4" />
                      Abstand
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="min-w-0 gap-1.5">
                          <FileDown className="h-4 w-4" />
                          Export
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('docx')}>Word (DOCX)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('md')}>Markdown</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('txt')}>Text</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ) : (
                <div className="shrink-0 h-9" />
              )}
            </div>
          </div>

      </div>

      {/* ── Footer ── */}
      <footer className="shrink-0 px-4 py-2 text-center text-[11px] tracking-[0.02em] text-phoro-slate/60">
        © 2026 PHORO
        <span className="mx-1.5">·</span>
        <a href="https://www.phoro.ch" target="_blank" rel="noopener noreferrer" className="hover:text-phoro-slate transition-colors">phoro.ch</a>
        <span className="mx-1.5">·</span>
        <a href="https://www.phoro.ch/impressum" target="_blank" rel="noopener noreferrer" className="hover:text-phoro-slate transition-colors">Impressum</a>
        <span className="mx-1.5">·</span>
        <a href="https://www.phoro.ch/datenschutz" target="_blank" rel="noopener noreferrer" className="hover:text-phoro-slate transition-colors">Datenschutz</a>
      </footer>
    </main>
  );
}
