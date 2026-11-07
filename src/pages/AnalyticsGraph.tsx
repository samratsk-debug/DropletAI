import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Award,
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
  const { brands, selectedBrand, contents, setSelectedBrandId } = useApp();
  const [timeRange, setTimeRange] = useState<'30D' | '90D' | 'All'>('All');
  const [hoveredQuarter, setHoveredQuarter] = useState<string | null>(null);

  const brandContents = contents.filter(item => item.brandId === selectedBrand.id);
  const sortedContents = [...brandContents].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const cutoff = timeRange === 'All' ? 0 : Date.now() - (timeRange === '30D' ? 30 : 90) * 24 * 60 * 60 * 1000;
  const filteredContents = sortedContents.filter(item => !cutoff || new Date(item.createdAt).getTime() >= cutoff);
  const valuationData = filteredContents.map(item => ({
    quarter: new Date(item.createdAt).toLocaleDateString(),
    complianceScore: item.complianceScore,
    flaggedAudits: item.issues.length,
    status: item.status
  }));
  const avgCompliance = valuationData.length ? Math.round(valuationData.reduce((sum, item) => sum + item.complianceScore, 0) / valuationData.length) : null;
  const totalFindings = valuationData.reduce((sum, item) => sum + item.flaggedAudits, 0);
  const approvedCount = filteredContents.filter(item => item.status === 'Approved').length;
  const passRate = filteredContents.length ? Math.round(approvedCount / filteredContents.length * 100) : null;

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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Brand audit</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review results for {selectedBrand.name}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          {/* Brand Switcher */}
          {brands.length > 1 && <select
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
          </select>}

          {/* Time Range Filter */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeRange('30D')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${timeRange === '30D' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('90D')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${timeRange === '90D' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              90 Days
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

      {/* KPI summary cards calculated from API submissions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Submissions</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{filteredContents.length}</div>
            <span className="inline-block mt-1 text-slate-500 text-[10px]">In selected period</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Average Compliance Index</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{avgCompliance === null ? '—' : `${avgCompliance}%`}</div>
            <span className="inline-block mt-1 text-slate-500 text-[10px]">Average from analysis reports</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Flagged Findings</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{totalFindings}</div>
            <span className="inline-block mt-1 text-slate-500 text-[10px]">Across these submissions</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Approved</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{passRate === null ? '—' : `${passRate}%`}</div>
            <span className="inline-block mt-1 text-slate-500 text-[10px]">Share of submissions approved</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Submission compliance and findings */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Submission Compliance and Findings</h2>
            <p className="text-xs text-slate-500">Results by submission date.</p>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-xs font-medium text-slate-600">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-blue-600 rounded-sm inline-block" />
              <span>Compliance Index (%)</span>
            </span>
            <span className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-rose-500 rounded-sm inline-block" /><span>Flagged findings</span></span>
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="quarter" stroke="var(--chart-label)" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="var(--chart-rose)" fontSize={11} tickLine={false} domain={[0, 'dataMax + 1']} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--chart-blue)" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white text-slate-900 p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-gray-200">
                        <p className="font-bold border-b border-slate-800 pb-1">{label}</p>
                        <p className="text-slate-800">Compliance Index: <span className="font-mono font-bold text-blue-700">{data.complianceScore}%</span></p>
                        <p className="text-slate-800">Flagged Issues: <span className="font-mono font-bold text-rose-700">{data.flaggedAudits}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="left" dataKey="flaggedAudits" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={24} />
              <Line yAxisId="right" type="monotone" dataKey="complianceScore" stroke="var(--chart-blue)" strokeWidth={3} dot={{ fill: 'var(--chart-blue)', r: 5 }} activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {valuationData.length === 0 && <p className="text-center text-xs text-slate-500 pb-4">No submissions in this period yet.</p>}
      </div>

      {/* 3. Detailed Quarterly Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">Submission Audit History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-gray-50">
                <th className="py-3 px-4">Quarter</th>
                <th className="py-3 px-4">Compliance Index (%)</th>
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
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{item.complianceScore}%</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{item.flaggedAudits}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'Pending Review' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
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
