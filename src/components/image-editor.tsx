'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Check, RotateCcw } from 'lucide-react';

interface ImageEditorProps {
  imageDataUrl: string;
  onConfirm: (editedBase64: string) => void;
  onCancel: () => void;
}

export function ImageEditor({ imageDataUrl, onConfirm, onCancel }: ImageEditorProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
  }, []);

  function handleReset() {
    setBrightness(100);
    setContrast(100);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }

  function handleConfirm() {
    const image = imgRef.current;
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
    if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      sx = completedCrop.x * scaleX;
      sy = completedCrop.y * scaleY;
      sw = completedCrop.width * scaleX;
      sh = completedCrop.height * scaleY;
    }

    canvas.width = sw;
    canvas.height = sh;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);

    const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    onConfirm(base64);
  }

  const hasChanges = brightness !== 100 || contrast !== 100 || !!completedCrop;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Action bar */}
      <div className="flex items-center justify-between py-2 shrink-0">
        <Button variant="ghost" size="sm" className="gap-1.5 text-phoro-slate" onClick={onCancel}>
          <X className="h-4 w-4" />
          Abbrechen
        </Button>
        <Button size="sm" className="gap-1.5" onClick={handleConfirm}>
          <Check className="h-4 w-4" />
          Übernehmen
        </Button>
      </div>

      {/* Image with crop overlay */}
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-lg bg-black/5">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-full"
        >
          <img
            src={imageDataUrl}
            alt="Bild bearbeiten"
            onLoad={onImageLoad}
            className="max-h-[55vh] max-w-full object-contain"
            style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
          />
        </ReactCrop>
      </div>

      {/* Controls */}
      <div className="shrink-0 pt-4 pb-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-phoro-slate w-22 shrink-0">Helligkeit</span>
          <Slider
            value={[brightness]}
            onValueChange={([v]) => setBrightness(v)}
            min={50}
            max={150}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-phoro-slate/60 w-10 text-right tabular-nums">{brightness}%</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-phoro-slate w-22 shrink-0">Kontrast</span>
          <Slider
            value={[contrast]}
            onValueChange={([v]) => setContrast(v)}
            min={50}
            max={150}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-phoro-slate/60 w-10 text-right tabular-nums">{contrast}%</span>
        </div>

        {hasChanges && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="gap-1.5 text-phoro-slate/60" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5" />
              Zurücksetzen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
