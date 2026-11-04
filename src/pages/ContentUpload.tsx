import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContentItem, AuditIssue } from '../types';

export const ContentUpload: React.FC = () => {
  const { brands, selectedBrandId, addContent, currentUser } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<ContentItem['type']>('document');
  const [contentBody, setContentBody] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80');

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contentBody) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      // Simulated Gemini AI + Rule-based generated issues
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
        },
        {
          id: 'iss-' + Date.now() + '-2',
          category: 'Tone Mismatches',
          severity: 'medium',
          title: 'Stylistic tone deviation',
          description: 'Enthusiasm or formality level deviates from brand calibration targets.',
          sourcePassage: 'Tone Guidelines: Authoritative enterprise tone required.',
          suggestedFix: 'Refine phrasing to match professional enterprise standard.',
          status: 'pending'
        }
      ];

      const newContent: ContentItem = {
        id: 'audit-' + Math.floor(1000 + Math.random() * 9000),
        title,
        type: contentType,
        brandId: selectedBrandId,
        brandName: brands.find(b => b.id === selectedBrandId)?.name || 'Droplet Core Hardware',
        author: currentUser.name,
        department: currentUser.department,
        createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        status: 'Pending Review',
        complianceScore: 81,
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

      addContent(newContent);
      navigate(`/audit/${newContent.id}`);
    }, 2000);
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Content Upload & Submission Workspace</h1>
            <p className="text-xs text-slate-400 mt-0.5">Submit marketing collateral, press releases, social ads, and banners for instant Gemini AI contextual audit.</p>
          </div>
        </div>
      </div>

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
                    <label className="block type text-xs font-medium text-slate-300 mb-1">Content Format</label>
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
                    <select
                      value={selectedBrandId}
                      disabled
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                    >
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
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

            {/* Drag and Drop Asset Zone */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-white">Visual / Media Attachment</h2>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  <ImageIcon className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-white mb-1">Drag and drop visual asset</p>
                  <p className="text-[11px] text-slate-400 mb-4">PNG, JPG, PDF, or DOCX up to 50MB</p>
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
                <span>Trigger AI Brand Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
