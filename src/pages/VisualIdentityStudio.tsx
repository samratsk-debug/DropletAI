import React, { useState } from 'react';
import { Sparkles, Eye, ShieldCheck, AlertTriangle, Layers, Grid, Sliders, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VisualIdentityStudio: React.FC = () => {
  const { guidelines } = useApp();
  const [showGrid, setShowGrid] = useState(true);
  const [showMask, setShowMask] = useState(true);
  const [showClearance, setShowClearance] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<string>('logo');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Visual Identity & Asset Validation Studio</h1>
              <p className="text-xs text-slate-400 mt-0.5">Automated visual auditing simulating OpenCV computer vision algorithms: logo safety clearance, color accuracy, and alignment grids.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span className="bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OpenCV Vision Engine v4.8: Calibrated</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Inspection Canvas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Inspection Viewport</span>
            </h2>

            {/* Canvas Toggles */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition select-none ${
                  showGrid ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                Alignment Grid
              </button>
              <button
                type="button"
                onClick={() => setShowClearance(!showClearance)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition select-none ${
                  showClearance ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                Clearance Zone
              </button>
              <button
                type="button"
                onClick={() => setShowMask(!showMask)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition select-none ${
                  showMask ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                Edge Mask
              </button>
            </div>
          </div>

          {/* Interactive Inspection Canvas */}
          <div className="relative w-full h-[460px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-8 select-none">
            {/* Grid overlay */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
            )}

            {/* Asset Mockup under inspection */}
            <div className="relative w-full max-w-lg aspect-video bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="relative group">
                  {/* Clearance boundary */}
                  {showClearance && (
                    <div className="absolute -inset-4 border-2 border-dashed border-amber-400/80 bg-amber-400/5 rounded-lg pointer-events-none flex items-start justify-end p-1">
                      <span className="text-[9px] font-mono text-amber-300 bg-slate-950/80 px-1 rounded">24px Clearance</span>
                    </div>
                  )}

                  {/* Logo Element */}
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-indigo-400/40">
                    D
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-500">Asset: Banner_Hero_v2</span>
              </div>

              {/* Edge Mask detection simulation */}
              {showMask && (
                <div className="absolute inset-x-6 bottom-6 h-12 border-2 border-emerald-500/80 bg-emerald-500/10 rounded flex items-center px-4 justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-300">OpenCV Bounding Box: [x: 48, y: 192, w: 420, h: 48]</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">PASSED</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OpenCV Validation Diagnostics Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Visual Audit Diagnostics</h2>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Logo Clearance Radius</span>
                  <span className="text-emerald-400 font-mono font-bold">28px (Req: 24px)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Clear space verification passed with +4px margin safety.</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Color Delta-E Accuracy</span>
                  <span className="text-indigo-400 font-mono font-bold">ΔE = 1.12 (Optimal)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '92%' }} />
                </div>
                <span className="text-[10px] text-slate-500 block">Hex code #6366f1 matches master brand palette tolerance.</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Aspect Ratio Distortion</span>
                  <span className="text-emerald-400 font-mono font-bold">0.00% Distortion</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                </div>
                <span className="text-[10px] text-slate-500 block">No unauthorized horizontal or vertical stretching detected.</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">Computer Vision Pipeline</span>
              <p className="text-[11px] text-indigo-200">
                Simulated OpenCV algorithms: Canny edge detection → Hough line transformation → Delta-E CIE76 color distance measurement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
