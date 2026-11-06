import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Award,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const AnalyticsGraph: React.FC = () => {
  const { brands, selectedBrand, setSelectedBrandId } = useApp();
  const [timeRange, setTimeRange] = useState<'4Q' | '8Q' | 'All'>('4Q');
  const [hoveredQuarter, setHoveredQuarter] = useState<string | null>(null);

  // Comprehensive quarterly financial & brand value turnout data
  const valuationData = [
    { quarter: 'Q1 2025', brandValueM: 42.5, complianceScore: 88.0, riskMitigatedM: 8.2, flaggedAudits: 14, status: 'Stable' },
    { quarter: 'Q2 2025', brandValueM: 48.0, complianceScore: 91.0, riskMitigatedM: 11.0, flaggedAudits: 9, status: 'Optimized' },
    { quarter: 'Q3 2025', brandValueM: 54.2, complianceScore: 93.0, riskMitigatedM: 14.5, flaggedAudits: 7, status: 'Optimal' },
    { quarter: 'Q4 2025', brandValueM: 61.0, complianceScore: 94.5, riskMitigatedM: 18.0, flaggedAudits: 5, status: 'Optimal' },
    { quarter: 'Q1 2026', brandValueM: 68.5, complianceScore: 95.2, riskMitigatedM: 22.4, flaggedAudits: 4, status: 'Secured' },
    { quarter: 'Q2 2026', brandValueM: 76.0, complianceScore: 96.8, riskMitigatedM: 27.1, flaggedAudits: 2, status: 'Master' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Brand Valuation & Turnout Analytics</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial brand equity turnout, valuation multiplier, and compliance-to-capital mitigation tracking for {selectedBrand.name}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          {/* Brand Switcher */}
          <select
            value={selectedBrand.id}
            onChange={(e) => {
              const b = brands.find(x => x.id === e.target.value);
              if (b) setSelectedBrandId(b.id);
            }}
            className="bg-white border border-gray-300 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-none cursor-pointer font-medium"
          >
            {brands.map(b => (
              <option key={b.id} value={b.id}>🏢 {b.name}</option>
            ))}
          </select>

          {/* Time Range Filter */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeRange('4Q')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${timeRange === '4Q' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              4 Quarters
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('8Q')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${timeRange === '8Q' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              8 Quarters
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('All')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${timeRange === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* 1. Top KPI Summary Cards (Metric Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Current Brand Valuation</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">$68.5M</div>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded">
              +28.4% YoY Growth
            </span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Average Compliance Index</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">95.2%</div>
            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold rounded">
              +7.2% vs Q1 2025
            </span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Risk Capital Mitigated</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">$22.4M</div>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded">
              Saved across 5 departments
            </span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Audit Pass Rate</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">94.5%</div>
            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold rounded">
              142 Audits Completed
            </span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Main Visual Graph ("Brand Valuation ($M) vs Compliance Index (%)") */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Brand Valuation Turnout ($M) vs Compliance Index (%)</h2>
            <p className="text-xs text-slate-500">Interactive historical composite chart tracking equity growth and governance performance.</p>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-xs font-medium text-slate-600">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-slate-900 rounded-sm inline-block" />
              <span>Brand Valuation ($M)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-blue-600 rounded-sm inline-block" />
              <span>Compliance Index (%)</span>
            </span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={valuationData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              onMouseMove={(state: any) => {
                if (state && state.activePayload && state.activePayload[0]) {
                  setHoveredQuarter(state.activePayload[0].payload.quarter);
                }
              }}
              onMouseLeave={() => setHoveredQuarter(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="quarter" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#0F172A" fontSize={11} tickLine={false} domain={[0, 90]} unit="M" />
              <YAxis yAxisId="right" orientation="right" stroke="#2563EB" fontSize={11} tickLine={false} domain={[80, 100]} unit="%" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                        <p className="font-bold border-b border-slate-800 pb-1">{label}</p>
                        <p className="text-slate-200">Brand Valuation: <span className="font-mono font-bold text-emerald-400">${data.brandValueM}M</span></p>
                        <p className="text-slate-200">Compliance Index: <span className="font-mono font-bold text-blue-400">{data.complianceScore}%</span></p>
                        <p className="text-slate-200">Risk Mitigated: <span className="font-mono font-bold text-emerald-400">${data.riskMitigatedM}M</span></p>
                        <p className="text-slate-200">Flagged Issues: <span className="font-mono font-bold text-rose-400">{data.flaggedAudits}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="left" dataKey="brandValueM" fill="#0F172A" radius={[6, 6, 0, 0]} barSize={36} />
              <Line yAxisId="right" type="monotone" dataKey="complianceScore" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Detailed Quarterly Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">Historical Quarterly Performance Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-gray-50">
                <th className="py-3 px-4">Quarter</th>
                <th className="py-3 px-4">Brand Valuation ($M)</th>
                <th className="py-3 px-4">Compliance Index (%)</th>
                <th className="py-3 px-4">Risk Mitigated ($M)</th>
                <th className="py-3 px-4">Flagged Audits</th>
                <th className="py-3 px-4">Governance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {valuationData.map((item, idx) => {
                const isHovered = hoveredQuarter === item.quarter;
                return (
                  <tr
                    key={idx}
                    className={`transition cursor-pointer ${isHovered ? 'bg-indigo-50/60' : 'hover:bg-gray-50'}`}
                    onMouseEnter={() => setHoveredQuarter(item.quarter)}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{item.quarter}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">${item.brandValueM}M</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{item.complianceScore}%</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600">${item.riskMitigatedM}M</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{item.flaggedAudits}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.status === 'Master' || item.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'Secured' || item.status === 'Optimized' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
