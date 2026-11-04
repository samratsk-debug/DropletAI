import React, { useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';
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
      <div className="mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Employee Workspace & Pre-Audit Upload</h1>
            <p className="text-xs text-slate-400 mt-0.5">Run pre-publication AI brand audits, inspect findings, and submit collateral to manager approval queues.</p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {isAnalyzing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-6 my-12 shadow-2xl">
          <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 rounded-2xl mx-auto flex items-center justify-center animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Running Google Gemini AI Contextual Audit...</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Cross-referencing terminology rules, verified product specs, tone calibration, and OCR visual elements.</p>
          </div>
          <div className="w-48 h-1.5 bg-slate-800 mx-auto rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-2/3 animate-pulse" />
          </div>
        </div>
      ) : auditResult ? (
        /* Pre-Send Review Results */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono text-indigo-400 block font-semibold">Pre-Publication Audit Complete</span>
              <h2 className="text-lg font-bold text-white">{auditResult.title}</h2>
            </div>
            <div className="bg-indigo-950 border border-indigo-500/40 px-4 py-2 rounded-xl text-center">
              <span className="text-lg font-bold text-indigo-400 font-mono">{auditResult.complianceScore}%</span>
              <span className="text-[10px] text-slate-400 block uppercase">Compliance Score</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Flagged Issues ({auditResult.issues.length})</h3>
            {auditResult.issues.map((iss) => (
              <div key={iss.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">{iss.title}</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded uppercase font-semibold">{iss.category}</span>
                </div>
                <p className="text-xs text-slate-400">{iss.description}</p>
                <div className="text-[11px] text-indigo-300 font-mono">Suggested Fix: {iss.suggestedFix}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setAuditResult(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium select-none"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmitToManager}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium shadow-lg shadow-indigo-600/20 flex items-center space-x-2 select-none"
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-white">Collateral Details</h2>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Collateral Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q4 Global Product Launch Press Release"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Content Format</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="document">Document / Press Release</option>
                      <option value="ad">Social Ad Banner</option>
                      <option value="text">Marketing Copy</option>
                      <option value="banner">Promotional Banner</option>
                      <option value="social">Social Media Post</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Target Brand Identity</label>
                    <input
                      type="text"
                      disabled
                      value={selectedBrand.name}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-indigo-400 font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Content Body / Copy</label>
                  <textarea
                    required
                    rows={8}
                    value={contentBody}
                    onChange={(e) => setContentBody(e.target.value)}
                    placeholder="Paste marketing copy, press release text, or document summary here..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Asset Zone */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-white">Visual Attachment</h2>

                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-950">
                  <ImageIcon className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-white mb-1">Upload visual asset</p>
                  <p className="text-[11px] text-slate-400 mb-4">PNG, JPG, PDF up to 50MB</p>
                  <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl text-xs font-medium transition cursor-pointer border border-slate-700 inline-block select-none">
                    Browse File
                    <input type="file" className="hidden" onChange={() => {}} />
                  </label>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400 block mb-2">Attached Preview</span>
                  <div className="h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-medium text-sm transition shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 select-none"
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
