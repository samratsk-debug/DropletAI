import React, { useState } from 'react';
import { FileText, Cpu, Scan, CheckCircle2, AlertCircle, FileSearch, RefreshCw } from 'lucide-react';

interface OCRParsedBox {
  id: string;
  text: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  status: 'passed' | 'warning' | 'error';
  complianceNote?: string;
}

export const DocumentOCRWorkspace: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<'banner' | 'pdf'>('banner');
  const [activeBoxId, setActiveBoxId] = useState<string | null>('box-1');

  const parsedBoxes: OCRParsedBox[] = [
    {
      id: 'box-1',
      text: 'DROPLET POD PRO X',
      confidence: 99.4,
      boundingBox: { x: 12, y: 15, width: 75, height: 18 },
      status: 'passed',
      complianceNote: 'Product name matches verified brand nomenclature.'
    },
    {
      id: 'box-2',
      text: 'INFINITE BATTERY LIFE',
      confidence: 98.1,
      boundingBox: { x: 12, y: 40, width: 70, height: 14 },
      status: 'error',
      complianceNote: 'Forbidden claim: Violates 24-hour hardware specification limit.'
    },
    {
      id: 'box-3',
      text: '100% WATERPROOF',
      confidence: 97.6,
      boundingBox: { x: 12, y: 60, width: 55, height: 14 },
      status: 'error',
      complianceNote: 'Prohibited terminology: Must use "IPX7 Water-resistant".'
    },
    {
      id: 'box-4',
      text: 'AI BRAIN INSIDE',
      confidence: 96.2,
      boundingBox: { x: 12, y: 80, width: 45, height: 12 },
      status: 'warning',
      complianceNote: 'Non-standard name: Replace with "Droplet Neural Engine".'
    }
  ];

  const activeBox = parsedBoxes.find(b => b.id === activeBoxId) || parsedBoxes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">OCR & Multi-Format Document Processing Workspace</h1>
              <p className="text-xs text-slate-400 mt-0.5">Deep visual text extraction simulating Tesseract OCR & Apache PDFBox / POI pipelines for promotional collateral.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span className="bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-400 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tesseract OCR v5.3 / PDFBox Engine: Active</span>
          </span>
        </div>
      </div>

      {/* Main OCR Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Document / Banner Canvas with Bounding Boxes */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Scan className="w-4 h-4 text-indigo-400" />
              <span>Extracted Optical Text Overlay (Interactive Canvas)</span>
            </h2>
            <div className="text-[10px] text-slate-400 font-mono">Click boxes to inspect NLP audit</div>
          </div>

          <div className="relative w-full h-[440px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            {/* Background collateral mockup */}
            <div className="relative w-full h-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold mb-4">
                  D
                </div>
                <div className="space-y-4">
                  {parsedBoxes.map((box) => (
                    <div
                      key={box.id}
                      onClick={() => setActiveBoxId(box.id)}
                      className={`cursor-pointer border-2 transition rounded px-2 py-1 select-none ${
                        activeBoxId === box.id
                          ? 'border-indigo-400 bg-indigo-500/20 shadow-md'
                          : box.status === 'error'
                          ? 'border-rose-500/60 bg-rose-500/10'
                          : box.status === 'warning'
                          ? 'border-amber-500/60 bg-amber-500/10'
                          : 'border-emerald-500/60 bg-emerald-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-white tracking-wider">{box.text}</span>
                        <span className="text-[9px] font-mono text-slate-400">{box.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>DPI: 300</span>
                <span>Colorspace: sRGB</span>
                <span>BBoxes: 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* OCR Inspector Details Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">OCR Token Inspector</h2>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold mb-1">Extracted Text Token</span>
                <span className="text-base font-bold text-white font-mono">{activeBox.text}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-850">
                <div>
                  <span className="text-[10px] text-slate-400 block">OCR Engine Confidence</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">{activeBox.confidence}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Governance Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase mt-0.5 ${
                    activeBox.status === 'passed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                    activeBox.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                    'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}>
                    {activeBox.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Gemini Rule Engine Finding</span>
              <p className="text-xs text-slate-300 leading-relaxed">{activeBox.complianceNote}</p>
            </div>

            <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">Document Parsing Pipeline</span>
              <p className="text-[11px] text-indigo-200">
                Simulated multi-stage ingestion: PDFBox stream tokenizer → Tesseract LSTM text layer extraction → Gemini contextual compliance scan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
