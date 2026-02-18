'use client';

import { useState, useRef, useEffect, RefObject, ChangeEvent } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { runOCR, simplifyText, OcrState, SimplifyState } from './actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, LoaderCircle, Sparkles, X } from 'lucide-react';

const ocrInitialState: OcrState = {
  text: null,
  errors: undefined,
};

const simplifyInitialState: SimplifyState = {
  message: null,
  errors: undefined,
};


function OcrFormContent() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="flex flex-col items-center text-white">
            <LoaderCircle className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-lg font-semibold">Extracting text...</p>
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
      {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />} 
      Simplify Text
    </Button>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [simplifyState, simplifyFormAction] = useActionState(simplifyText, simplifyInitialState);
  const [ocrState, ocrFormAction] = useActionState(runOCR, ocrInitialState);

  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);


  useEffect(() => {
    async function setupCamera() {
      setCameraError(null);
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } else {
          setCameraError("Your browser does not support camera access.");
        }
      } catch (error) {
          console.error("Camera Permission Error:", error);
          if (error instanceof DOMException && error.name === "NotAllowedError") {
              setCameraError("Camera access was denied. Please allow camera permission in your browser settings.");
          } else {
              setCameraError("Could not start camera. Please ensure it is not in use by another application.");
          }
      }
    }

    if (activeTab === 'camera') {
        setupCamera();
    }

    // Cleanup camera stream when component unmounts or tab changes
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [activeTab]);

  useEffect(() => {
    if (ocrState.text) {
      setText(ocrState.text);
      setActiveTab('text'); // Switch to text tab after successful OCR
    }
  }, [ocrState.text]);

  // Action for the main camera form (using video stream)
  const captureAndSubmit = (formData: FormData) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState >= 2) { // Check if video has enough data
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        formData.set('image', dataUrl.split(',')[1]);
        ocrFormAction(formData);
      }
    }
  };

  // Handler for the file input fallback
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = (e.target?.result as string)?.split(',')[1];
            if (base64) {
                const formData = new FormData();
                formData.set('image', base64);
                ocrFormAction(formData);
            }
        };
        reader.readAsDataURL(file);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <header className="p-4 border-b bg-gray-100 flex flex-col items-center">
            <img src="/logo-phoro.svg" alt="PHORO Read" className="h-10" />
            <p className="text-center text-gray-500 mt-1">Take a photo, simplify the text.</p>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="p-4">
            <form action={simplifyFormAction} className="space-y-4">
              <div className="relative">
                <Textarea
                  name="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Text from your photo will appear here..."
                  className="w-full h-60 text-lg"
                />
                {text && (
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setText('')}>
                    <X className="h-4 w-4"/>
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                  <input type="hidden" name="mode" value="text" />
                  <SimplifySubmitButton />
              </div>
              {simplifyState?.message && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <p className="text-blue-800">{simplifyState.message}</p>
                  </div>
              )}
              {simplifyState?.errors?.text && (
                <div className="p-2 text-center text-red-500">
                  <p>{simplifyState.errors.text[0]}</p>
                </div>
              )}
            </form>
          </TabsContent>

          <TabsContent value="camera" className="p-4">
             <form action={captureAndSubmit}>
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                    {/* --- FIX: Added playsInline, autoPlay, muted for iOS --- */}
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                    <OcrFormContent />
                </div>
             </form>

            {/* Fallback and Error Display Area */}
            <div className="mt-4 text-center">
                {cameraError && <p className="text-sm text-red-600 mb-2">{cameraError}</p>}
                
                {/* --- FIX: Fallback file input --- */}
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer text-sm text-slate-600">
                    Camera not working? 
                    <span className="font-semibold text-blue-600 hover:underline">Upload an image instead.</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
            </div>

            {ocrState.errors?.image && (
              <div className="mt-2 p-2 text-center text-red-500">
                <p>{ocrState.errors.image[0]}</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </TabsContent>
        </Tabs>
      </div>
       <footer className="mt-6 text-center text-gray-500 text-sm">
        <p>Powered by Claude & Firebase</p>
      </footer>
    </main>
  );
}
