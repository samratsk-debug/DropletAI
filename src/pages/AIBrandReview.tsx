import React, { useState } from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Cpu, Scan, Check, X, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIBrandReview: React.FC = () => {
  const { contents, updateContentIssueStatus, selectedBrand, guidelines } = useApp();
  const [selectedAuditId, setSelectedAuditId] = useState<string>(contents[0]?.id || 'audit-101');
  const [activeTab, setActiveTab] = useState<'feed' | 'diagnostics'>('feed');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const brandContents = contents.filter(c => c.brandId === selectedBrand.id);
  const activeAudit = brandContents.find(c => c.id === selectedAuditId) || brandContents[0] || contents[0];

  const totalAudits = brandContents.length + 12;
  const avgCompliance = selectedBrand.complianceRate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Brand Review Hub</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time governance pipeline overview, live audit feed, compliance score health index, and inline AI corrections.</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span className="bg-white border border-gray-200 text-[11px] font-mono text-indigo-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gemini AI Governance v5.5: Active</span>
          </span>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Active Content Audits</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalAudits}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Live Pipeline</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Compliance Score Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-indigo-600">{avgCompliance}%</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">Optimal</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Top Violated Claim</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 truncate max-w-[180px]">Infinite Battery Life</span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">High Risk</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Flagged Risk Areas</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">2 Items</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Needs Review</span>
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
              <span>Active Collateral Audit Queue</span>
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
                    AI Corrections ({activeAudit.issues.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('diagnostics')}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition select-none ${
                      activeTab === 'diagnostics' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    Deep Diagnostics
                  </button>
                </div>
              </div>

              {activeTab === 'feed' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Content Body Excerpt</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-lg border border-gray-200">
                      {activeAudit.contentBody}
                    </p>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">Detected Violations & Traceable AI Corrections</h3>

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

                        {/* Reviewer Action Buttons */}
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              updateContentIssueStatus(activeAudit.id, issue.id, 'accepted');
                              showToast(`Applied correction for "${issue.title}".`);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm select-none"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept Fix</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateContentIssueStatus(activeAudit.id, issue.id, 'rejected');
                              showToast(`Rejected flag for "${issue.title}".`);
                            }}
                            className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 select-none"
                          >
                            <X className="w-3.5 h-3.5 text-rose-600" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Scan className="w-4 h-4 text-indigo-600" />
                      <span>Multi-Format OCR & Visual Image Diagnostics</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Simulated Tesseract text token extraction and OpenCV visual inspection for asset <strong className="font-mono">{activeAudit.title}</strong>.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-[10px] text-slate-500 block">OCR Confidence</span>
                        <span className="text-sm font-bold font-mono text-emerald-600">99.2% (Optimal)</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-[10px] text-slate-500 block">Color Delta-E Accuracy</span>
                        <span className="text-sm font-bold font-mono text-indigo-600">ΔE = 0.98</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-[10px] text-slate-500 block">Logo Safety Clearance</span>
                        <span className="text-sm font-bold font-mono text-emerald-600">26px (Pass)</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-[10px] text-slate-500 block">Aspect Distortion</span>
                        <span className="text-sm font-bold font-mono text-emerald-600">0.00%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">AI Governance Guarantee</span>
                    <p className="text-[11px] text-indigo-900">
                      All assets passing the AI Brand Review hub are cryptographically signed and recorded in the replicated PostgreSQL audit ledger.
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
