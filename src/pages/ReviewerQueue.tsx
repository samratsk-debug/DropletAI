import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Filter, Eye, CheckCircle2, Share2, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewerQueue: React.FC = () => {
  const { contents, updateContentStatus, selectedBrand, currentUser } = useApp();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [publishModalContent, setPublishModalContent] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredContents = contents.filter(c => {
    if (filterStatus === 'All') return true;
    return c.status === filterStatus;
  });

  const handleShareToPlatform = (platform: 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram') => {
    const text = encodeURIComponent(publishModalContent?.contentBody || 'Droplet AI Approved Collateral');
    let url = '';
    if (platform === 'Twitter') {
      url = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (platform === 'LinkedIn') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=https://dropletai.domain`;
    } else if (platform === 'Facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=https://dropletai.domain`;
    } else {
      url = `https://instagram.com`;
    }
    window.open(url, '_blank');
    showToast(`Launched ${platform} pre-filled publishing intent!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Reviewer Portal & Approval Queue</h1>
              <p className="text-xs text-slate-400 mt-0.5">Authorised reviewer triage queue for sign-off, collateral inspection, and one-click social media publishing.</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses ({contents.length})</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Changes Requested">Changes Requested</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Collateral Details</th>
              <th className="px-6 py-4">Brand & Department</th>
              <th className="px-6 py-4">Compliance Score</th>
              <th className="px-6 py-4">Flagged Issues</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredContents.map((item) => (
              <tr key={item.id} className="hover:bg-slate-850/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-white mb-0.5">{item.title}</div>
                  <span className="text-[11px] text-slate-500 font-mono">Format: {item.type.toUpperCase()} • Submitted: {item.createdAt}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-white font-medium">{item.brandName}</div>
                  <span className="text-[11px] text-slate-400">{item.author} ({item.department})</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-indigo-400 font-mono">{item.complianceScore}%</span>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.complianceScore >= 90 ? 'bg-emerald-500' : item.complianceScore >= 80 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                        style={{ width: `${item.complianceScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300">
                    {item.issues.length} flagged
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase ${
                    item.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                    item.status === 'Changes Requested' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                    item.status === 'Rejected' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                    'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/audit/${item.id}`)}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-lg text-xs font-medium transition flex items-center space-x-1 select-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Report</span>
                    </button>

                    {item.status === 'Approved' && (
                      <button
                        type="button"
                        onClick={() => setPublishModalContent(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition flex items-center space-x-1 select-none"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}

                    {item.status === 'Pending Review' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateContentStatus(item.id, 'Approved', 'Fast-track approval from queue');
                          showToast('Collateral approved & personal author score incremented.');
                        }}
                        className="px-2.5 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-medium hover:bg-emerald-900/50 transition select-none"
                        title="Quick Approve"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Social Media Publishing Modal */}
      {publishModalContent && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Share2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-white">Publish Approved Collateral</h2>
              </div>
              <button type="button" onClick={() => setPublishModalContent(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold block">✓ Approved Brand Collateral</span>
                <p className="text-xs text-white font-medium">{publishModalContent.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-3 font-mono">{publishModalContent.contentBody}</p>
              </div>

              <span className="text-xs text-slate-400 block">Select destination social media channels:</span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleShareToPlatform('LinkedIn')}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 transition select-none"
                >
                  <span className="text-[#0A66C2] font-bold">in</span>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareToPlatform('Twitter')}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 transition select-none"
                >
                  <span className="font-bold text-white">𝕏</span>
                  <span>Twitter / X</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareToPlatform('Facebook')}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 transition select-none"
                >
                  <span className="text-[#1877F2] font-bold">f</span>
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareToPlatform('Instagram')}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 transition select-none"
                >
                  <span className="text-[#E4405F] font-bold">📸</span>
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
