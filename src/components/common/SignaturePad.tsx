import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  label?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ 
  onSave, 
  label = "Student / Operator Digital Signature" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasDrawn) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSave('');
  };

  return (
    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
          <PenTool className="w-3.5 h-3.5 text-blue-600" />
          <span>{label}</span>
        </label>
        {hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 px-2 py-0.5 rounded-lg hover:bg-red-50 transition"
          >
            <Eraser className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="relative bg-white rounded-xl border border-slate-300 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-24 touch-none cursor-crosshair block"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 italic">
            Sign here with finger or mouse to authorize equipment handover
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 mt-1 text-right">
        Legally binding institutional custody verification record
      </p>
    </div>
  );
};
