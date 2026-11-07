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

  const handleShareToPlatform = (_platform: 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram') => {
    showToast('Publishing isn’t set up yet. No content was published.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Review queue</h1>
              <p className="text-xs text-slate-500 mt-0.5">Review findings and move work forward.</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-medium"
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
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Collateral Details</th>
              <th className="px-6 py-4">Brand & Department</th>
              <th className="px-6 py-4">Compliance Score</th>
              <th className="px-6 py-4">Flagged Issues</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-slate-700">
            {filteredContents.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 mb-0.5">{item.title}</div>
                  <span className="text-[11px] text-slate-500 font-mono">Format: {item.type.toUpperCase()} • Submitted: {item.createdAt}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900 font-medium">{item.brandName}</div>
                  <span className="text-[11px] text-slate-500">{item.author} ({item.department})</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-indigo-600 font-mono">{item.complianceScore}%</span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.complianceScore >= 90 ? 'bg-emerald-600' : item.complianceScore >= 80 ? 'bg-indigo-600' : 'bg-amber-500'}`}
                        style={{ width: `${item.complianceScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-700">
                    {item.issues.length} flagged
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase ${
                    item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    item.status === 'Changes Requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    item.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/audit/${item.id}`)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-slate-900 hover:text-white text-slate-800 border border-gray-300 hover:border-slate-900 rounded-lg text-xs font-semibold transition flex items-center space-x-1 select-none"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Report</span>
                    </button>

                    {item.status === 'Approved' && (
                      <button
                        type="button"
                        onClick={() => setPublishModalContent(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1 shadow select-none"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}

                    {item.status === 'Pending Review' && (
                      <button
                        type="button"
                        onClick={() => {
                          void updateContentStatus(item.id, 'Approved', 'Fast-track approval from queue')
                            .then(() => showToast('Collateral approved.'))
                            .catch(() => showToast('Could not approve the content.'));
                        }}
                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition select-none"
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-600">
                <Share2 className="w-5 h-5" />
                <h2 className="text-base font-bold text-slate-900">Publish Approved Collateral</h2>
              </div>
              <button type="button" onClick={() => setPublishModalContent(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] text-emerald-700 uppercase font-mono font-bold block">✓ Approved Brand Collateral</span>
                <p className="text-xs text-slate-900 font-semibold">{publishModalContent.title}</p>
                <p className="text-[11px] text-slate-600 line-clamp-3 font-mono">{publishModalContent.contentBody}</p>
              </div>

              <span className="text-xs text-slate-600 block">Select destination social media channels:</span>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleShareToPlatform('LinkedIn')}
                  className="py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-center space-x-2 transition select-none shadow-sm"
                >
                  <span className="text-[#0A66C2] font-bold">in</span>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareToPlatform('Twitter')}
                  className="py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-center space-x-2 transition select-none shadow-sm"
                >
                  <span className="font-bold text-slate-900">𝕏</span>
                  <span>Twitter / X</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareToPlatform('Facebook')}
                  className="py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-center space-x-2 transition select-none shadow-sm"
                >
                  <span className="text-[#1877F2] font-bold">f</span>
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareToPlatform('Instagram')}
                  className="py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-center space-x-2 transition select-none shadow-sm"
                >
                  <span className="text-[#E4405F] font-bold">📸</span>
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
