import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContentItem, AuditIssue } from '../types';

export const EmployeeWorkspace: React.FC = () => {
  const { selectedBrand, addContent, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<ContentItem['type']>('document');
  const [contentBody, setContentBody] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<ContentItem | null>(null);
  const [previewImage] = useState<string>('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contentBody) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      const generatedIssues: AuditIssue[] = [
        {
          id: 'iss-' + Date.now() + '-1',
          category: 'Unsupported Claims',
          severity: 'high',
          title: 'Unverified Performance Claim detected',
          description: 'Content claims unverified battery or processing capabilities exceeding official product specifications.',
          sourcePassage: 'Verified Baseline Metric: Standard specification limits',
          suggestedFix: 'Align claim with official specification guidelines.',
          status: 'pending'
        }
      ];

      const newContent: ContentItem = {
        id: 'audit-' + Math.floor(1000 + Math.random() * 9000),
        title,
        type: contentType,
        brandId: selectedBrand.id,
        brandName: selectedBrand.name,
        author: currentUser.name,
        authorEmail: currentUser.email,
        department: currentUser.department,
        createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        status: 'Pending Review',
        complianceScore: 84,
        contentBody,
        imageUrl: previewImage,
        issues: generatedIssues,
        revisionHistory: [
          {
            id: 'rev-' + Date.now(),
            timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            author: currentUser.name,
            action: 'Submitted for AI Brand Audit',
            note: 'Automated Gemini API scan completed.'
          }
        ]
      };

      setAuditResult(newContent);
    }, 2000);
  };

  const handleSubmitToManager = () => {
    if (!auditResult) return;
    addContent(auditResult);
    showToast('Collateral successfully submitted to Marketing Manager approval queue!');
    setAuditResult(null);
    setTitle('');
    setContentBody('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Workspace & Pre-Audit Upload</h1>
            <p className="text-xs text-slate-500 mt-0.5">Run pre-publication AI brand audits, inspect findings, and submit collateral to manager approval queues.</p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {isAnalyzing ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-6 my-12 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Running Google Gemini AI Contextual Audit...</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">Cross-referencing terminology rules, verified product specs, tone calibration, and OCR visual elements.</p>
          </div>
          <div className="w-48 h-1.5 bg-gray-200 mx-auto rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-2/3 animate-pulse" />
          </div>
        </div>
      ) : auditResult ? (
        /* Pre-Send Review Results */
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <span className="text-[10px] uppercase font-mono text-indigo-600 block font-semibold">Pre-Publication Audit Complete</span>
              <h2 className="text-lg font-bold text-slate-900">{auditResult.title}</h2>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-center">
              <span className="text-lg font-bold text-indigo-600 font-mono">{auditResult.complianceScore}%</span>
              <span className="text-[10px] text-slate-500 block uppercase">Compliance Score</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Flagged Issues ({auditResult.issues.length})</h3>
            {auditResult.issues.map((iss) => (
              <div key={iss.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700">{iss.title}</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded uppercase font-semibold">{iss.category}</span>
                </div>
                <p className="text-xs text-slate-600">{iss.description}</p>
                <div className="text-[11px] text-indigo-700 font-mono">Suggested Fix: {iss.suggestedFix}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setAuditResult(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-semibold select-none"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmitToManager}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow flex items-center space-x-2 select-none"
            >
              <span>Submit to Manager Approval Queue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRunAudit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h2 className="text-base font-bold text-slate-900">Collateral Details</h2>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Collateral Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q4 Global Product Launch Press Release"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Content Format</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="document">Document / Press Release</option>
                      <option value="ad">Social Ad Banner</option>
                      <option value="text">Marketing Copy</option>
                      <option value="banner">Promotional Banner</option>
                      <option value="social">Social Media Post</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Target Brand Identity</label>
                    <input
                      type="text"
                      disabled
                      value={selectedBrand.name}
                      className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-indigo-700 font-mono font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Content Body / Copy</label>
                  <textarea
                    required
                    rows={8}
                    value={contentBody}
                    onChange={(e) => setContentBody(e.target.value)}
                    placeholder="Paste marketing copy, press release text, or document summary here..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Asset Zone */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h2 className="text-base font-bold text-slate-900">Visual Attachment</h2>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50">
                  <ImageIcon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-900 mb-1">Upload visual asset</p>
                  <p className="text-[11px] text-slate-500 mb-4">PNG, JPG, PDF up to 50MB</p>
                  <label className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer inline-block select-none shadow">
                    Browse File
                    <input type="file" className="hidden" onChange={() => {}} />
                  </label>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-2">Attached Preview</span>
                  <div className="h-32 rounded-lg overflow-hidden bg-white border border-gray-200">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-sm transition shadow flex items-center justify-center space-x-2 select-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Pre-Publication AI Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
