import React, { useState } from 'react';
import { Globe2, ShieldAlert, TrendingDown, Layers, ArrowUpRight, BarChart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EnterpriseAnalytics: React.FC = () => {
  const { brands } = useApp();
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Brand & Enterprise Governance Analytics</h1>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated compliance surveillance across portfolio brands, business units, and global subsidiaries.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year-to-Date</option>
          </select>
        </div>
      </div>

      {/* Cross-Brand Comparative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-bold text-white">{brand.name}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                brand.riskLevel === 'Low' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                brand.riskLevel === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                'bg-rose-950 text-rose-300 border border-rose-500/30'
              }`}>
                {brand.riskLevel} Risk
              </span>
            </div>

            <div className="text-2xl font-bold text-indigo-400 font-mono mb-2">{brand.complianceRate}%</div>

            <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>Active Audits:</span>
                <span className="text-white font-mono">{brand.activeAuditsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Departments:</span>
                <span className="text-white font-mono">{brand.departmentCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="text-slate-500 font-mono text-[10px]">{brand.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Macro Risk Analysis & Trend Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Aggregated Risk Index by Portfolio Brand</h2>
            <span className="text-xs text-slate-400 font-mono">Normalized scale (0 - 100)</span>
          </div>

          <div className="space-y-4">
            {[
              { brand: 'Droplet Audio Labs', risk: 68, primaryViolation: 'Overstated Battery Performance', level: 'Elevated' },
              { brand: 'Droplet Enterprise Cloud', risk: 38, primaryViolation: 'Latency & Security Superlatives', level: 'Moderate' },
              { brand: 'Droplet Mobile OS', risk: 22, primaryViolation: 'Logo Clear Space Inconsistencies', level: 'Low' },
              { brand: 'Droplet Core Hardware', risk: 14, primaryViolation: 'Minor Terminology Mismatches', level: 'Minimal' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{item.brand}</span>
                  <span className="font-mono text-rose-400 font-semibold">{item.risk} Risk Pts</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.risk > 50 ? 'bg-rose-500' : item.risk > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${item.risk}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block">Primary Vulnerability: <span className="text-slate-300">{item.primaryViolation}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Cross-Brand Governance Alerts</h2>

          <div className="space-y-3">
            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Audio Labs Audit Spike</span>
              </div>
              <p className="text-[11px] text-slate-400">Audio Labs has failed 4 consecutive audits due to battery metric discrepancies.</p>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Terminology Sync Outdated</span>
              </div>
              <p className="text-[11px] text-slate-400">Droplet Mobile OS guideline repository is pending Q4 nomenclature sync.</p>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>Core Hardware High Compliance</span>
              </div>
              <p className="text-[11px] text-slate-400">Core Hardware achieved 94.5% compliance across 12 consecutive campaigns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
