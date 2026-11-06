import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Search, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContentHistoryAnalytics: React.FC = () => {
  const { contents } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContents = contents.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content History & Governance Analytics</h1>
              <p className="text-xs text-slate-500 mt-0.5">Track historical compliance metrics, department error frequencies, and turnaround efficiency.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            type="button"
            className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-2 shadow-sm select-none"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit Log</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Average Compliance Score</span>
          <div className="text-3xl font-bold text-indigo-600 font-mono">87.2%</div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center space-x-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.8% improvement this month</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Total Audits Completed</span>
          <div className="text-3xl font-bold text-slate-900 font-mono">1,482</div>
          <p className="text-xs text-slate-500 mt-2">Across 4 enterprise sub-brands</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Average Review Turnaround</span>
          <div className="text-3xl font-bold text-indigo-600 font-mono">4.2 hrs</div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center space-x-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>62% faster than manual review</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Prevented Compliance Violations</span>
          <div className="text-3xl font-bold text-emerald-600 font-mono">312</div>
          <p className="text-xs text-slate-500 mt-2">Intercepted pre-publication</p>
        </div>
      </div>

      {/* Recurring Issues Breakdown & Department Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Top Recurring Brand Inconsistencies</h2>
          <div className="space-y-3">
            {[
              { label: 'Unsupported Battery Claims', count: 84, pct: 38 },
              { label: 'Prohibited Absolute Terms ("Waterproof", "Instant")', count: 62, pct: 28 },
              { label: 'Trademark Nomenclature Non-compliance', count: 45, pct: 20 },
              { label: 'Logo Margin & Clear Space Violations', count: 31, pct: 14 },
            ].map((err, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{err.label}</span>
                  <span className="text-slate-500 font-mono">{err.count} incidents ({err.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${err.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Compliance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Compliance Rate by Department</h2>
          <div className="space-y-3">
            {[
              { dept: 'Legal & Executive Communications', score: 98, status: 'Optimal' },
              { dept: 'Visual & Graphic Design', score: 92, status: 'High' },
              { dept: 'Copywriting & Content Creation', score: 86, status: 'Satisfactory' },
              { dept: 'Regional Performance Marketing', score: 79, status: 'Needs Training' },
            ].map((d, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{d.dept}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Status: {d.status}</span>
                </div>
                <div className="text-sm font-bold text-indigo-600 font-mono">{d.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Audit Decision Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Searchable Audit Decision Log</h2>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, brand or author..."
              className="w-full bg-white border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3.5">Collateral</th>
              <th className="px-6 py-3.5">Brand Identity</th>
              <th className="px-6 py-3.5">Author</th>
              <th className="px-6 py-3.5">Audit Date</th>
              <th className="px-6 py-3.5">Score</th>
              <th className="px-6 py-3.5">Final Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-slate-700">
            {filteredContents.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">{c.title}</td>
                <td className="px-6 py-4">{c.brandName}</td>
                <td className="px-6 py-4 text-slate-600">{c.author}</td>
                <td className="px-6 py-4 font-mono text-slate-500">{c.createdAt}</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">{c.complianceScore}%</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    c.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    c.status === 'Changes Requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
