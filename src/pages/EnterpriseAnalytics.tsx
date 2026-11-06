import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, ShieldAlert, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EnterpriseAnalytics: React.FC = () => {
  const { brands, setSelectedBrandId } = useApp();
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Multi-Brand & Enterprise Governance Analytics</h1>
              <p className="text-xs text-slate-500 mt-0.5">Aggregated compliance surveillance across portfolio brands, business units, and global subsidiaries.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-white border border-gray-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-medium"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year-to-Date</option>
          </select>
        </div>
      </div>

      {/* Cross-Brand Comparative Cards (Clickable to AnalyticsGraph) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => {
              setSelectedBrandId(brand.id);
              navigate(`/${brand.slug}/AnalyticsGraph`);
            }}
            className="bg-white border border-gray-200 hover:border-slate-900 rounded-2xl p-6 relative shadow-sm hover:shadow-md transition cursor-pointer select-none group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">{brand.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                  brand.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  brand.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {brand.riskLevel} Risk
                </span>
              </div>

              <div className="text-2xl font-bold text-blue-600 font-mono">{brand.complianceRate}%</div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span>Active Audits:</span>
                  <span className="text-slate-900 font-mono font-semibold">{brand.activeAuditsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Departments:</span>
                  <span className="text-slate-900 font-mono font-semibold">{brand.departmentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span className="text-slate-500 font-mono text-[10px]">{brand.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-600">
              <span>View Valuation Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Macro Risk Analysis & Trend Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Aggregated Risk Index by Portfolio Brand</h2>
            <span className="text-xs text-slate-500 font-mono">Normalized scale (0 - 100)</span>
          </div>

          <div className="space-y-4">
            {[
              { brand: 'Droplet Audio Labs', risk: 68, primaryViolation: 'Overstated Battery Performance', level: 'Elevated' },
              { brand: 'Droplet Enterprise Cloud', risk: 38, primaryViolation: 'Latency & Security Superlatives', level: 'Moderate' },
              { brand: 'Droplet Mobile OS', risk: 22, primaryViolation: 'Logo Clear Space Inconsistencies', level: 'Low' },
              { brand: 'Droplet Core Hardware', risk: 14, primaryViolation: 'Minor Terminology Mismatches', level: 'Minimal' },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{item.brand}</span>
                  <span className="font-mono text-rose-600 font-semibold">{item.risk} Risk Pts</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.risk > 50 ? 'bg-rose-600' : item.risk > 30 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                    style={{ width: `${item.risk}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 block">Primary Vulnerability: <span className="text-slate-800 font-medium">{item.primaryViolation}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Cross-Brand Governance Alerts</h2>

          <div className="space-y-3">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-rose-800 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Audio Labs Audit Spike</span>
              </div>
              <p className="text-[11px] text-slate-600">Audio Labs has failed 4 consecutive audits due to battery metric discrepancies.</p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Terminology Sync Outdated</span>
              </div>
              <p className="text-[11px] text-slate-600">Droplet Mobile OS guideline repository is pending Q4 nomenclature sync.</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <span>Core Hardware High Compliance</span>
              </div>
              <p className="text-[11px] text-slate-600">Core Hardware achieved 94.5% compliance across 12 consecutive campaigns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
