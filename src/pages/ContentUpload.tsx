import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContentItem } from '../types';
import { ApiError, api } from '../api';

export const ContentUpload: React.FC = () => {
  const { brands, selectedBrandId, addContent, currentUser, organisationId } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<ContentItem['type']>('document');
  const [contentBody, setContentBody] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [formError, setFormError] = useState('');

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!selectedBrandId) {
      setFormError('Create a brand before submitting content for review.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const contentTypeToApi: Record<ContentItem['type'], string> = {
        document: 'MARKETING_COPY', ad: 'AD', text: 'MARKETING_COPY', banner: 'AD', social: 'SOCIAL_MEDIA'
      };
      const submission = await api.createSubmission(organisationId, {
        brandId: selectedBrandId,
        title,
        contentType: contentTypeToApi[contentType],
        content: contentBody
      });
      const issueLines = submission.analysisReport?.issuesJson && !submission.analysisReport.issuesJson.startsWith('No major')
        ? submission.analysisReport.issuesJson.split(/\r?\n/).map(line => line.replace(/^\s*-\s*/, '').trim()).filter(Boolean)
        : [];
      const score = Math.max(0, 100 - (submission.analysisReport?.riskScore ?? 0));
      const newContent: ContentItem = {
        id: submission.id,
        title: submission.title,
        type: contentType,
        brandId: submission.brandId,
        brandName: submission.brandName,
        author: submission.submittedByEmail,
        authorEmail: submission.submittedByEmail,
        department: currentUser.department,
        createdAt: submission.createdAt,
        status: 'Pending Review',
        complianceScore: score,
        contentBody: submission.content,
        issues: issueLines.map((line, index) => ({
          id: `${submission.id}-issue-${index}`,
          category: 'Unsupported Claims',
          severity: submission.analysisReport?.riskCategory === 'HIGH' || submission.analysisReport?.riskCategory === 'CRITICAL' ? 'high' : 'medium',
          title: `Finding ${index + 1}`,
          description: line,
          suggestedFix: submission.analysisReport?.aiRecommendations || 'Review against approved brand guidance.',
          status: 'pending'
        })),
        revisionHistory: [{
          id: `${submission.id}-submitted`,
          timestamp: submission.createdAt,
          author: currentUser.name,
          action: 'Submitted for AI Brand Audit',
          note: submission.analysisReport?.summary || 'Analysis complete.'
        }]
      };
      addContent(newContent);
      navigate(`/audit/${newContent.id}`);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Could not submit the content.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const uploadSelectedFile = async (file?: File) => {
    if (!file) return;
    setSelectedFile(file);
    setUploadMessage('Uploading document…');
    setFormError('');
    try {
      await api.uploadDocument(organisationId, file, selectedBrandId || undefined);
      setUploadMessage(`${file.name} uploaded and added to brand knowledge.`);
    } catch (error) {
      setUploadMessage('');
      setFormError(error instanceof ApiError ? error.message : 'Could not upload the document.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Submit content</h1>
            <p className="text-xs text-slate-600 mt-0.5">Check a draft against your brand guidance before it goes out.</p>
          </div>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-6 my-12 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-2xl mx-auto flex items-center justify-center animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Running AI contextual audit…</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">Checking this draft against the selected brand&apos;s guidance.</p>
          </div>
          <div className="w-48 h-1.5 bg-gray-200 mx-auto rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-2/3 animate-pulse" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleRunAudit} className="space-y-6">
          {formError && <p role="alert" className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-800">{formError}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-slate-900">Collateral Details</h2>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Collateral Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q4 Global Product Launch Press Release"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block type text-xs font-medium text-slate-700 mb-1">Content Format</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
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
                    <select
                      value={selectedBrandId}
                      disabled
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                    >
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
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
                    className="w-full bg-white border border-gray-300 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Drag and Drop Asset Zone */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-semibold text-slate-900">Visual / Media Attachment</h2>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); void uploadSelectedFile(e.dataTransfer.files[0]); }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <ImageIcon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-900 mb-1">Drag and drop visual asset</p>
                  <p className="text-[11px] text-slate-600 mb-4">Add a reference document. Paste copy below for a content check.</p>
                  <label className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-medium transition cursor-pointer border border-indigo-200 inline-block select-none">
                    Browse File
                    <input type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={(e) => void uploadSelectedFile(e.target.files?.[0])} />
                  </label>
                  {uploadMessage && <p className="mt-3 text-[11px] text-emerald-700">{uploadMessage}</p>}
                  {selectedFile && <p className="mt-1 text-[11px] text-slate-600">Selected: {selectedFile.name}</p>}
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-medium text-slate-600 block mb-2">Attached Preview</span>
                  <div className="h-32 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                    {selectedFile?.type.startsWith('image/') ? <span className="text-xs text-slate-500">Image added to your knowledge base</span> : <span className="text-xs text-slate-500">No preview available</span>}
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
