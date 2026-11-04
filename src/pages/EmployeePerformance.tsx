import React from 'react';
import { BarChart3, TrendingUp, Award, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmployeePerformance: React.FC = () => {
  const { currentUser, contents } = useApp();

  // Filter content authored by current user
  const myContents = contents.filter(c => c.author === currentUser.name || c.authorEmail === currentUser.email);
  const approvedCount = myContents.filter(c => c.status === 'Approved').length;
  const rejectedCount = myContents.filter(c => c.status === 'Rejected').length;
  const pendingCount = myContents.filter(c => c.status === 'Pending Review' || c.status === 'Changes Requested').length;

  const currentScore = currentUser.personalComplianceScore || 88;
  const history = currentUser.historyScores || [
    { date: 'Oct 5', score: 76, label: 'Initial Blog' },
    { date: 'Oct 14', score: 80, label: 'Social Copy' },
    { date: 'Oct 25', score: 82, label: 'Ad Copy #3' },
    { date: 'Nov 3', score: 88, label: 'Press Release' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Individual Creator Performance Dashboard</h1>
              <p className="text-xs text-slate-400 mt-0.5">Personal compliance rating trends, submission quality scores, and approval rates.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {currentScore}%
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold">Personal Rating</span>
              <span className="text-xs text-white font-medium">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Total Submissions</span>
          <div className="text-3xl font-bold text-white font-mono">{myContents.length}</div>
          <p className="text-xs text-slate-500 mt-2">Personal collateral audit history</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Approved Collateral</span>
          <div className="text-3xl font-bold text-emerald-400 font-mono">{approvedCount}</div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed manager review (+Score)</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Changes / Rejections</span>
          <div className="text-3xl font-bold text-rose-400 font-mono">{rejectedCount}</div>
          <p className="text-xs text-rose-400 mt-2 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Penalized compliance rating</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Approval Ratio</span>
          <div className="text-3xl font-bold text-indigo-400 font-mono">
            {myContents.length > 0 ? Math.round((approvedCount / myContents.length) * 100) : 100}%
          </div>
          <p className="text-xs text-indigo-400 mt-2 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Quality benchmark</span>
          </p>
        </div>
      </div>

      {/* SVG Performance Line Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Compliance Rating Trend History</h2>
            <p className="text-xs text-slate-400">Chronological trajectory of AI audit score performance.</p>
          </div>
          <span className="bg-indigo-950 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase">
            Trajectory: +12% Growth
          </span>
        </div>

        <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col justify-between relative">
          {/* SVG line */}
          <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

            {/* Polyline */}
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              points="20,110 160,85 320,70 470,25"
            />

            {/* Dots */}
            {[
              { x: 20, y: 110, score: 76 },
              { x: 160, y: 85, score: 80 },
              { x: 320, y: 70, score: 82 },
              { x: 470, y: 25, score: currentScore },
            ].map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <text x={p.x} y={p.y - 12} fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {p.score}%
                </text>
              </g>
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            {history.map((h, idx) => (
              <span key={idx}>{h.date} ({h.label})</span>
            ))}
          </div>
        </div>
      </div>

      {/* Creator's Submission Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider">My Submitted Collateral History</h2>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3.5">Collateral Title</th>
              <th className="px-6 py-3.5">Submission Date</th>
              <th className="px-6 py-3.5">AI Compliance Score</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {myContents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No collateral submitted yet. Use the Upload & Audit tab to submit.</td>
              </tr>
            ) : (
              myContents.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/50 transition">
                  <td className="px-6 py-4 font-bold text-white">{c.title}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{c.createdAt}</td>
                  <td className="px-6 py-4 font-mono font-bold text-indigo-400">{c.complianceScore}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      c.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                      c.status === 'Changes Requested' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                      c.status === 'Rejected' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                      'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
