import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Building2, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnterpriseBrand } from '../types';

export const BrandHomeHub: React.FC = () => {
  const { brands, addBrand, setSelectedBrandId, currentUser } = useApp();
  const navigate = useNavigate();

  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [brandLogoUrl, setBrandLogoUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80');

  const isOwner = currentUser.role === 'Brand Owner / Admin';

  // For employees, show only assigned brands (or all if not restricted)
  const displayedBrands = isOwner ? brands : brands.filter(b => currentUser.assignedBrandIds?.includes(b.id) || true);

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName) return;

    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newBrand: EnterpriseBrand = {
      id: 'b-' + Date.now(),
      slug,
      name: brandName,
      logo: brandLogoUrl,
      complianceRate: 92.0,
      activeAuditsCount: 4,
      riskLevel: 'Low',
      lastSync: new Date().toISOString().replace('T', ' ').slice(0, 16),
      departmentCount: 3,
      description: brandDescription || 'Enterprise sub-brand governance repository.'
    };

    addBrand(newBrand);
    setSelectedBrandId(newBrand.id);
    setShowAddBrandModal(false);
    navigate(`/${slug}/BrandGuidelines`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Brand Hub</h1>
              <p className="text-xs text-slate-500 mt-0.5">Select a brand workspace or manage your authorized portfolio repositories.</p>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => setShowAddBrandModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-2 shadow select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Brand</span>
            </button>
          </div>
        )}
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{brand.name}</h3>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    brand.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    brand.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {brand.riskLevel} Risk • {brand.complianceRate}% Compliance
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{brand.description}</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Active Audits: {brand.activeAuditsCount}</span>
                <span>Departments: {brand.departmentCount}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedBrandId(brand.id);
                  navigate(isOwner ? `/${brand.slug}/EnterpriseAnalytics` : `/${brand.slug}/EmployeeWorkspace`);
                }}
                className="w-full py-2.5 bg-gray-50 hover:bg-slate-900 hover:text-white text-slate-800 border border-gray-300 hover:border-slate-900 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 select-none"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Add New Enterprise Brand</h2>
              <button type="button" onClick={() => setShowAddBrandModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Droplet Quantum Cloud"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="Brief description of brand product vertical..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Brand Logo Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBrandLogoUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white cursor-pointer"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowAddBrandModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow select-none">Create Brand Hub</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
