import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
  FileText,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApiError } from '../api';

export const ContentAuditReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contents, updateContentStatus, selectedBrand } = useApp();

  const content = contents.find(c => c.id === id) || contents[0];
  const [activeTab, setActiveTab] = useState<'split' | 'issues' | 'history'>('split');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('Violates verified specification limits and terminology guidelines.');
  const [toast, setToast] = useState<string | null>(null);

  if (!content) return <div className="max-w-3xl mx-auto p-8 text-center text-slate-600">This audit is not available in the loaded workspace.</div>;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignOff = (status: 'Approved' | 'Changes Requested' | 'Rejected', note?: string) => {
    if (status !== 'Approved' && !note?.trim() && !rejectNote.trim()) {
      showToast('Please provide reviewer feedback before requesting changes or rejecting this item.');
      return;
    }
    void updateContentStatus(content.id, status, note || rejectNote)
      .then(() => {
        showToast(`Collateral status updated to ${status}`);
        setShowRejectModal(false);
      })
      .catch(error => showToast(error instanceof ApiError ? error.message : 'Could not update review status.'));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/${selectedBrand.slug}/ApprovalQueue`)}
            className="p-2 bg-white border border-gray-300 rounded-xl text-slate-600 hover:text-slate-900 shadow-sm transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{content.title}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                content.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                content.status === 'Changes Requested' || content.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {content.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Brand: <span className="text-indigo-600 font-semibold">{content.brandName}</span> • Author: {content.author} ({content.department})</p>
          </div>
        </div>

        {/* Compliance Meter & Reviewer Sign-off Actions */}
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm">
              {content.complianceScore}%
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold">Compliance Score</span>
              <span className="text-xs text-slate-900 font-medium">Gemini AI Audited</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleSignOff('Approved', 'Approved by authorized reviewer')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow flex items-center space-x-1.5 select-none"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition shadow flex items-center space-x-1.5 select-none"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject / Changes</span>
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6">
        {[
          { id: 'split', label: 'Interactive Split View (Content vs Audit)' },
          { id: 'issues', label: `Flagged Issues (${content.issues.length})` },
          { id: 'history', label: `Revision History (${content.revisionHistory.length})` },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition select-none ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
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
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col h-full overflow-hidden shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Submitted Collateral & Visual Asset</span>
            </h2>

            <div className="flex-1 overflow-y-auto slim-scrollbar space-y-4 pr-2">
              {content.imageUrl && (
                <div className="h-48 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                  <img src={content.imageUrl} alt="Asset preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {content.contentBody}
              </div>
            </div>
          </div>

          {/* Right: Audit Report & Traceability */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col h-full overflow-hidden shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Gemini AI Findings & Traceable Guidelines</span>
            </h2>

            <div className="flex-1 overflow-y-auto slim-scrollbar space-y-4 pr-2">
              {content.issues.map((issue) => (
                <div key={issue.id} className={`p-4 rounded-xl border ${
                  issue.status === 'accepted' ? 'bg-emerald-50/50 border-emerald-200 opacity-75' :
                  issue.status === 'rejected' ? 'bg-gray-50 border-gray-200 opacity-50' :
                  'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase mb-1 ${
                        issue.severity === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {issue.category} • {issue.severity} severity
                      </span>
                      <h3 className="text-xs font-bold text-slate-900">{issue.title}</h3>
                    </div>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                      issue.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      issue.status === 'rejected' ? 'bg-gray-200 text-slate-600' :
                      'bg-indigo-50 text-indigo-700'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">{issue.description}</p>

                  {issue.sourcePassage && (
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-[11px] text-indigo-700 font-mono mb-3">
                      <span className="text-slate-400 block text-[9px] uppercase font-sans mb-0.5">Traceable Brand Source:</span>
                      "{issue.sourcePassage}"
                    </div>
                  )}

                  <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">AI Recommended Correction:</span>
                    <p className="text-xs text-indigo-900 font-mono">{issue.suggestedFix}</p>

                  {issue.status === 'pending' && (
                    <p className="pt-2 text-[11px] text-slate-500">Per-finding accept and dismiss actions are not supported by the connected review API.</p>
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
            <div key={issue.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  {issue.category}
                </span>
                <span className="text-xs text-slate-500 font-mono uppercase font-semibold">{issue.severity} priority</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{issue.title}</h3>
              <p className="text-xs text-slate-600 mb-4">{issue.description}</p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="text-xs text-indigo-600 font-bold block mb-1">Recommended Fix:</span>
                <p className="text-xs text-slate-900 font-mono">{issue.suggestedFix}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Revision History & Audit Timeline</h2>
          <div className="space-y-4">
            {content.revisionHistory.map((rev) => (
              <div key={rev.id} className="flex space-x-4 items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-900">{rev.action}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{rev.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{rev.note}</p>
                  <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">Actor: {rev.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject / Changes Feedback Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-900">Reject / Request Changes</h2>
              </div>
              <button type="button" onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Please provide reviewer feedback or correction notes for the author. This will automatically update their performance score.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reviewer Feedback Note</label>
                <textarea
                  rows={4}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-rose-600 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-medium select-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSignOff('Rejected', rejectNote)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow select-none"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
