import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Resource } from '../../types';
import { Download, Printer, QrCode, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QRCodeModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ resource, onClose }) => {
  const { setCurrentTab, setIsQrScannerOpen } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!resource) return;
    const codePayload = resource.qrCodeData || `CAMPUSSHARE:RESOURCE:${resource.id}`;
    QRCode.toDataURL(codePayload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('Error generating QR:', err);
    });
  }, [resource]);

  if (!resource) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `CampusShare-QR-${resource.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>CampusShare Asset Tag - ${resource.id}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .card { border: 2px dashed #0f172a; padding: 24px; max-width: 360px; margin: 0 auto; border-radius: 12px; }
            h2 { margin: 8px 0; color: #1e3a8a; }
            .id { font-size: 20px; font-weight: bold; background: #e0f2fe; padding: 4px 12px; display: inline-block; border-radius: 6px; }
            img { margin: 16px 0; }
            p { font-size: 12px; color: #64748b; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <p style="font-weight: bold; color: #2563eb;">CAMPUSSHARE EQUIPMENT TAG</p>
            <h2>${resource.name}</h2>
            <div class="id">ID: ${resource.id}</div>
            <br />
            <img src="${qrDataUrl}" width="220" />
            <p><strong>Location:</strong> ${resource.location}</p>
            <p><strong>Owner:</strong> ${resource.ownerName}</p>
            <p style="font-size: 10px; margin-top: 12px;">Scan with CampusShare App for Verified Check-In/Return</p>
          </div>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleQuickTestScan = () => {
    onClose();
    setCurrentTab('qr-tracking');
    setIsQrScannerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <QrCode className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Official Asset QR Code</h3>
              <p className="text-xs text-blue-200">Cryptographically verifiable equipment tag</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Resource ID: {resource.id}</span>
          </div>

          <h4 className="text-xl font-bold text-slate-800">{resource.name}</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">{resource.category} • {resource.location}</p>

          {/* QR Container */}
          <div className="mt-5 p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`QR code for ${resource.name}`} 
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                <span className="text-sm">Generating QR code...</span>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-2 text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-md max-w-[240px] truncate">
              {resource.qrCodeData || `CAMPUSSHARE:RESOURCE:${resource.id}`}
            </div>
          </div>

          <div className="mt-4 flex items-center text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Ready for Check-In & Return scanning at equipment cage</span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 hover:border-slate-400 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-sm hover:bg-slate-900 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Asset Tag</span>
            </button>
          </div>

          <button
            onClick={handleQuickTestScan}
            className="w-full mt-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-200"
          >
            ⚡ Test Scan This Resource in QR Hub
          </button>
        </div>
      </div>
    </div>
  );
};
