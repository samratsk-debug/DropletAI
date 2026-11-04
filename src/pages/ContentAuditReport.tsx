import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  FileText,
  Check,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContentAuditReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contents, updateContentIssueStatus, updateContentStatus } = useApp();

  const content = contents.find(c => c.id === id) || contents[0];
  const [activeTab, setActiveTab] = useState<'split' | 'issues' | 'history'>('split');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAcceptFix = (issueId: string, suggestedFix: string) => {
    updateContentIssueStatus(content.id, issueId, 'accepted', suggestedFix);
    showToast('AI recommended fix accepted & applied to collateral');
  };

  const handleRejectFix = (issueId: string) => {
    updateContentIssueStatus(content.id, issueId, 'rejected');
    showToast('Audit flag dismissed');
  };

  const handleSignOff = (status: 'Approved' | 'Changes Requested' | 'Rejected') => {
    updateContentStatus(content.id, status, `Formal sign-off by Reviewer: ${status}`);
    showToast(`Collateral status updated to ${status}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-white tracking-tight">{content.title}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                content.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                content.status === 'Changes Requested' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
              }`}>
                {content.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Brand: <span className="text-indigo-400">{content.brandName}</span> • Author: {content.author} ({content.department})</p>
          </div>
        </div>

        {/* Compliance Meter & Reviewer Sign-off Actions */}
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {content.complianceScore}%
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold">Compliance Score</span>
              <span className="text-xs text-white font-medium">Gemini AI Audited</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleSignOff('Approved')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 select-none"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              type="button"
              onClick={() => handleSignOff('Changes Requested')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-amber-600/20 flex items-center space-x-1.5 select-none"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Request Changes</span>
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 mb-6">
        {[
          { id: 'split', label: 'Interactive Split View (Content vs Audit)' },
          { id: 'issues', label: `Flagged Issues (${content.issues.length})` },
          { id: 'history', label: `Revision History (${content.revisionHistory.length})` },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition select-none ${
              activeTab === t.id
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
          {/* Left: Original Content & Visual Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full overflow-hidden">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Submitted Collateral & Visual Asset</span>
            </h2>

            <div className="flex-1 overflow-y-auto slim-scrollbar space-y-4 pr-2">
              {content.imageUrl && (
                <div className="h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img src={content.imageUrl} alt="Asset preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {content.contentBody}
              </div>
            </div>
          </div>

          {/* Right: Audit Report & Traceability */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full overflow-hidden">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Gemini AI Findings & Traceable Guidelines</span>
            </h2>

            <div className="flex-1 overflow-y-auto slim-scrollbar space-y-4 pr-2">
              {content.issues.map((issue) => (
                <div key={issue.id} className={`p-4 rounded-xl border ${
                  issue.status === 'accepted' ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75' :
                  issue.status === 'rejected' ? 'bg-slate-950/40 border-slate-800 opacity-50' :
                  'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase mb-1 ${
                        issue.severity === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                        'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {issue.category} • {issue.severity} severity
                      </span>
                      <h3 className="text-xs font-bold text-white">{issue.title}</h3>
                    </div>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                      issue.status === 'accepted' ? 'bg-emerald-950 text-emerald-300' :
                      issue.status === 'rejected' ? 'bg-slate-800 text-slate-400' :
                      'bg-indigo-950 text-indigo-300'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{issue.description}</p>

                  {issue.sourcePassage && (
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-indigo-300 font-mono mb-3">
                      <span className="text-slate-500 block text-[9px] uppercase font-sans mb-0.5">Traceable Brand Source:</span>
                      "{issue.sourcePassage}"
                    </div>
                  )}

                  <div className="bg-indigo-950/40 p-3 rounded-lg border border-indigo-500/30 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block">AI Recommended Correction:</span>
                    <p className="text-xs text-indigo-200 font-mono">{issue.suggestedFix}</p>

                    {issue.status === 'pending' && (
                      <div className="flex space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleAcceptFix(issue.id, issue.suggestedFix)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition flex items-center space-x-1 select-none"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Correction</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectFix(issue.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition select-none"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-4">
          {content.issues.map((issue) => (
            <div key={issue.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  {issue.category}
                </span>
                <span className="text-xs text-slate-400 font-mono uppercase">{issue.severity} priority</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{issue.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{issue.description}</p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-indigo-400 font-medium block mb-1">Recommended Fix:</span>
                <p className="text-xs text-white font-mono">{issue.suggestedFix}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-semibold text-white">Revision History & Audit Timeline</h2>
          <div className="space-y-4">
            {content.revisionHistory.map((rev) => (
              <div key={rev.id} className="flex space-x-4 items-start pb-4 border-b border-slate-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-white">{rev.action}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{rev.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{rev.note}</p>
                  <span className="text-[11px] text-indigo-400 mt-0.5 block">Actor: {rev.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
