import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmployeePerformance: React.FC = () => {
  const { currentUser, contents } = useApp();
  const myContents = contents
    .filter(c => c.authorEmail?.toLowerCase() === currentUser.email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const approvedCount = myContents.filter(c => c.status === 'Approved').length;
  const rejectedCount = myContents.filter(c => c.status === 'Rejected').length;
  const avgScore = myContents.length ? Math.round(myContents.reduce((sum, c) => sum + c.complianceScore, 0) / myContents.length) : null;
  const approvalRatio = myContents.length ? Math.round((approvedCount / myContents.length) * 100) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow"><BarChart3 className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My submissions</h1>
            <p className="text-xs text-slate-500 mt-0.5">Review your content status and results.</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm">{avgScore === null ? '—' : `${avgScore}%`}</div>
          <div><span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold">Average analysis score</span><span className="text-xs text-slate-900 font-semibold">{currentUser.name}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Metric label="Total submissions" value={myContents.length} note="All time" />
        <Metric label="Approved" value={approvedCount} note="Ready to share" tone="green" icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
        <Metric label="Rejected" value={rejectedCount} note="Needs attention" tone="rose" icon={<AlertTriangle className="w-3.5 h-3.5" />} />
        <Metric label="Approval Ratio" value={approvalRatio === null ? '—' : `${approvalRatio}%`} note="Approved / all submissions" tone="indigo" icon={<TrendingUp className="w-3.5 h-3.5" />} />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200"><h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">My Submitted Content</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-slate-500 uppercase font-semibold"><tr><th className="px-6 py-3.5">Title</th><th className="px-6 py-3.5">Submitted</th><th className="px-6 py-3.5">Analysis Score</th><th className="px-6 py-3.5">Status</th></tr></thead>
            <tbody className="divide-y divide-gray-200 text-slate-700">
              {myContents.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No submissions from this account yet.</td></tr> : myContents.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition"><td className="px-6 py-4 font-bold text-slate-900">{c.title}</td><td className="px-6 py-4 font-mono text-slate-500">{new Date(c.createdAt).toLocaleString()}</td><td className="px-6 py-4 font-mono font-bold text-indigo-600">{c.complianceScore}%</td><td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-gray-100 text-slate-700 border border-gray-200">{c.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string | number; note: string; tone?: 'green' | 'rose' | 'indigo'; icon?: React.ReactNode }> = ({ label, value, note, tone, icon }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">{label}</span>
    <div className="text-3xl font-bold text-slate-900 font-mono">{value}</div>
    <p className={`text-xs mt-2 flex items-center space-x-1 font-medium ${tone === 'green' ? 'text-emerald-600' : tone === 'rose' ? 'text-rose-600' : tone === 'indigo' ? 'text-indigo-600' : 'text-slate-500'}`}>{icon}<span>{note}</span></p>
  </div>
);
