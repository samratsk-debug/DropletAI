import React, { useState } from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Cpu, Scan, Check, X, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIBrandReview: React.FC = () => {
  const { contents, selectedBrand, guidelines } = useApp();
  const [selectedAuditId, setSelectedAuditId] = useState<string>(contents[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'feed' | 'diagnostics'>('feed');
  const brandContents = contents.filter(c => c.brandId === selectedBrand.id);
  const activeAudit = brandContents.find(c => c.id === selectedAuditId) || brandContents[0];
  const totalAudits = brandContents.length;
  const avgCompliance = brandContents.length ? Math.round(brandContents.reduce((sum, c) => sum + c.complianceScore, 0) / brandContents.length) : null;
  const flaggedIssues = brandContents.reduce((sum, c) => sum + c.issues.length, 0);
  const topFinding = brandContents.flatMap(c => c.issues).reduce<Record<string, number>>((counts, issue) => ({ ...counts, [issue.title]: (counts[issue.title] || 0) + 1 }), {});
  const topFindingLabel = Object.entries(topFinding).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI review</h1>
            <p className="text-xs text-slate-500 mt-0.5">Check analysis and open findings.</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0" aria-hidden="true"><Cpu className="w-5 h-5 text-indigo-600" /></div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Submissions</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalAudits}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Average score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-indigo-600">{avgCompliance === null ? '—' : `${avgCompliance}%`}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Most common finding</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{topFindingLabel || 'No findings yet'}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Open findings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{flaggedIssues}</span>
          </div>
        </div>
      </div>

      {/* Main Review Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Collateral Audit List */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Recent submissions</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">{brandContents.length} items</span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto slim-scrollbar pr-1">
            {brandContents.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAuditId(item.id)}
                className={`p-4 rounded-xl border transition cursor-pointer select-none space-y-2 ${
                  activeAudit?.id === item.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">{item.author} • {item.department}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    item.status === 'Changes Requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    item.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100">
                  <span className="font-mono text-slate-600">Score: <strong className="text-indigo-600">{item.complianceScore}%</strong></span>
                  <span className="font-mono text-slate-500">{item.issues.length} flags detected</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inline AI Corrections & Diagnostics */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          {activeAudit ? (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{activeAudit.title}</h2>
                  <span className="text-xs font-mono text-slate-500">ID: {activeAudit.id} • Brand: {activeAudit.brandName}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('feed')}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition select-none ${
                      activeTab === 'feed' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    Findings ({activeAudit.issues.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('diagnostics')}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition select-none ${
                      activeTab === 'diagnostics' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    Analysis details
                  </button>
                </div>
              </div>

              {activeTab === 'feed' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Submitted content</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-lg border border-gray-200">
                      {activeAudit.contentBody}
                    </p>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">Findings</h3>

                  <div className="space-y-3 max-h-[340px] overflow-y-auto slim-scrollbar pr-1">
                    {activeAudit.issues.map((issue) => (
                      <div key={issue.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                            <span className="text-xs font-bold text-slate-900">{issue.title}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            issue.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            issue.status === 'modified' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            issue.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {issue.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>

                        <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                          <span className="text-[10px] font-mono text-indigo-600 font-bold block">AI Recommended Correction:</span>
                          <p className="text-xs text-slate-800 font-medium">{issue.suggestedFix}</p>
                        </div>

                        {issue.sourcePassage && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Reference Guideline: {issue.sourcePassage}
                          </div>
                        )}

                        <p className="pt-2 border-t border-gray-200 text-[11px] text-slate-500">Open the audit report to approve or request changes.</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Scan className="w-4 h-4 text-indigo-600" />
                      <span>About this check</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      This check reviews text only. Images, logos, and colors aren’t checked.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">Select a collateral audit item to inspect AI corrections.</div>
          )}
        </div>
      </div>
    </div>
  );
};
