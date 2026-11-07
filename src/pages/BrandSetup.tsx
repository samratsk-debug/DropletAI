import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Sliders, Palette, FileCode, CheckCircle, Shield, Edit3, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BrandSetup: React.FC = () => {
  const { guidelines, updateGuidelines, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'specs' | 'terminology' | 'tone' | 'visuals' | 'colors'>('specs');
  const [toast, setToast] = useState<string | null>(null);

  const isOwner = currentUser.role === 'Brand Owner / Admin';

  // Modal states for editing or adding (Owner only)
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [editingSpecId, setEditingSpecId] = useState<string | null>(null);
  const [specForm, setSpecForm] = useState({
    productName: '',
    subtitle: '',
    verifiedMetric: '',
    allowedClaims: 'Up to 24h battery, ANC',
    forbiddenClaims: 'Infinite battery, Waterproof',
    waterResistanceRating: 'IPX7'
  });

  const [showTermModal, setShowTermModal] = useState(false);
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [termForm, setTermForm] = useState({
    term: '',
    correction: '',
    reason: '',
    category: 'forbidden' as 'mandatory' | 'forbidden' | 'preferred',
    context: ''
  });

  const [showColorModal, setShowColorModal] = useState(false);
  const [colorForm, setColorForm] = useState({
    name: 'New Swatch',
    hex: '#6366f1',
    type: 'solid' as 'solid' | 'gradient',
    gradientStop: '#06b6d4',
    gradientAngle: 135,
    role: 'primary' as const
  });

  // Visual asset edit modal state
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState({
    name: '',
    type: 'logo' as 'logo' | 'banner' | 'icon' | 'typography',
    minClearancePx: 24,
    usageGuidelines: '',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveGuidelines = async (updater: Parameters<typeof updateGuidelines>[0], successMessage: string) => {
    const saved = await updateGuidelines(updater);
    if (saved) showToast(successMessage);
  };

  // Spec handlers
  const handleOpenAddSpec = () => {
    if (!isOwner) return;
    setEditingSpecId(null);
    setSpecForm({ productName: '', subtitle: '', verifiedMetric: '', allowedClaims: '', forbiddenClaims: '', waterResistanceRating: 'IPX7' });
    setShowSpecModal(true);
  };

  const handleOpenEditSpec = (spec: any) => {
    if (!isOwner) return;
    setEditingSpecId(spec.id);
    setSpecForm({
      productName: spec.productName,
      subtitle: spec.subtitle || '',
      verifiedMetric: spec.verifiedMetric,
      allowedClaims: spec.allowedClaims.join(', '),
      forbiddenClaims: spec.forbiddenClaims.join(', '),
      waterResistanceRating: spec.waterResistanceRating
    });
    setShowSpecModal(true);
  };

  const handleSaveSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    const allowed = specForm.allowedClaims.split(',').map(s => s.trim()).filter(Boolean);
    const forbidden = specForm.forbiddenClaims.split(',').map(s => s.trim()).filter(Boolean);

    let saved = false;
    if (editingSpecId) {
      saved = await updateGuidelines(prev => ({
        ...prev,
        productSpecs: prev.productSpecs.map(s => s.id === editingSpecId ? {
          ...s,
          productName: specForm.productName,
          subtitle: specForm.subtitle,
          verifiedMetric: specForm.verifiedMetric,
          allowedClaims: allowed,
          forbiddenClaims: forbidden,
          waterResistanceRating: specForm.waterResistanceRating,
          maxBatteryLifeHours: 24
        } : s)
      }));
    } else {
      const newSpec = {
        id: 'spec-' + Date.now(),
        productName: specForm.productName || 'New Product',
        subtitle: specForm.subtitle,
        verifiedMetric: specForm.verifiedMetric || 'Verified metric',
        allowedClaims: allowed.length ? allowed : ['Standard claim'],
        forbiddenClaims: forbidden.length ? forbidden : ['Unverified claim'],
        maxBatteryLifeHours: 24,
        waterResistanceRating: specForm.waterResistanceRating
      };
      saved = await updateGuidelines(prev => ({ ...prev, productSpecs: [...prev.productSpecs, newSpec] }));
    }
    if (saved) { showToast('Product specification saved.'); setShowSpecModal(false); }
  };

  const handleDeleteSpec = (id: string) => {
    if (!isOwner) return;
    void saveGuidelines(prev => ({ ...prev, productSpecs: prev.productSpecs.filter(s => s.id !== id) }), 'Specification deleted.');
  };

  // Terminology handlers
  const handleOpenAddTerm = () => {
    if (!isOwner) return;
    setEditingTermId(null);
    setTermForm({ term: '', correction: '', reason: '', category: 'forbidden', context: '' });
    setShowTermModal(true);
  };

  const handleOpenEditTerm = (t: any) => {
    if (!isOwner) return;
    setEditingTermId(t.id);
    setTermForm({ term: t.term, correction: t.correction, reason: t.reason, category: t.category, context: t.context || '' });
    setShowTermModal(true);
  };

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    let saved = false;
    if (editingTermId) {
      saved = await updateGuidelines(prev => ({
        ...prev,
        terminologyRules: prev.terminologyRules.map(tr => tr.id === editingTermId ? {
          ...tr,
          term: termForm.term,
          correction: termForm.correction,
          reason: termForm.reason,
          category: termForm.category,
          context: termForm.context
        } : tr)
      }));
    } else {
      const newTr = {
        id: 'term-' + Date.now(),
        term: termForm.term,
        correction: termForm.correction,
        reason: termForm.reason,
        category: termForm.category,
        context: termForm.context
      };
      saved = await updateGuidelines(prev => ({ ...prev, terminologyRules: [...prev.terminologyRules, newTr] }));
    }
    if (saved) { showToast('Terminology rule saved.'); setShowTermModal(false); }
  };

  const handleDeleteTerm = (id: string) => {
    if (!isOwner) return;
    void saveGuidelines(prev => ({ ...prev, terminologyRules: prev.terminologyRules.filter(t => t.id !== id) }), 'Terminology rule removed.');
  };

  // Color Palette handlers
  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    const newColor = {
      id: 'c-' + Date.now(),
      name: colorForm.name,
      hex: colorForm.hex,
      type: colorForm.type,
      gradientStop: colorForm.gradientStop,
      gradientAngle: colorForm.gradientAngle,
      role: colorForm.role
    };
    const saved = await updateGuidelines(prev => ({ ...prev, colorPalette: [...prev.colorPalette, newColor] }));
    if (saved) { setShowColorModal(false); showToast('Color swatch saved.'); }
  };

  const handleDeleteColor = (id: string) => {
    if (!isOwner) return;
    void saveGuidelines(prev => ({ ...prev, colorPalette: prev.colorPalette.filter(c => c.id !== id) }), 'Color swatch removed.');
  };

  // Visual Asset Edit / Add handlers
  const handleOpenEditAsset = (asset: any) => {
    if (!isOwner) return;
    setEditingAssetId(asset.id);
    setAssetForm({
      name: asset.name,
      type: asset.type,
      minClearancePx: asset.minClearancePx,
      usageGuidelines: asset.usageGuidelines || '',
      url: asset.url
    });
    setShowAssetModal(true);
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    if (editingAssetId) {
      const saved = await updateGuidelines(prev => ({
        ...prev,
        visualAssets: prev.visualAssets.map(va => va.id === editingAssetId ? {
          ...va,
          name: assetForm.name,
          type: assetForm.type,
          minClearancePx: assetForm.minClearancePx,
          usageGuidelines: assetForm.usageGuidelines,
          url: assetForm.url
        } : va)
      }));
      if (!saved) return;
      showToast('Visual asset details saved.');
    } else {
      showToast('Image changes aren’t supported here. No changes were saved.');
    }
    setShowAssetModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Brand guidelines</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOwner ? 'Manage the rules and facts your team uses.' : 'Review the rules and facts for this brand.'}
              </p>
            </div>
          </div>
        </div>

        {!isOwner && (
          <div className="mt-4 md:mt-0">
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
              🔒 Read-Only Access ({currentUser.role})
            </span>
          </div>
        )}
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'specs', label: 'Product Specs & Claims', icon: FileCode },
          { id: 'terminology', label: 'Terminology Rules', icon: BookOpen },
          { id: 'tone', label: 'Tone of Voice', icon: Sliders },
          { id: 'visuals', label: 'Visual Assets & Logos', icon: Plus },
          { id: 'colors', label: 'Color Palette Studio', icon: Palette },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap select-none ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Product Specs */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Verified Product Specifications</h2>
            {isOwner && (
              <button
                type="button"
                onClick={handleOpenAddSpec}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add Specification</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.productSpecs.map((spec) => (
              <div key={spec.id} className="bg-white border border-gray-200 rounded-2xl p-6 relative group space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{spec.productName}</h3>
                    {spec.subtitle && <p className="text-xs text-slate-500">{spec.subtitle}</p>}
                    <p className="text-xs text-indigo-600 font-mono mt-1 font-semibold">{spec.waterResistanceRating}</p>
                  </div>
                  {isOwner && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSpec(spec)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg transition"
                        title="Edit specification"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpec(spec.id)}
                        className="p-1.5 bg-gray-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition"
                        title="Delete specification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <span className="text-slate-500 block font-medium mb-1">Verified Baseline Metric</span>
                    <span className="text-slate-900 font-mono font-medium">{spec.verifiedMetric}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-medium mb-1">Allowed Claims</span>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.allowedClaims.map((ac, idx) => (
                        <span key={idx} className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg font-medium">
                          ✓ {ac}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-medium mb-1">Strictly Forbidden Claims</span>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.forbiddenClaims.map((fc, idx) => (
                        <span key={idx} className="bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded-lg font-medium">
                          ✕ {fc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Terminology Rules */}
      {activeTab === 'terminology' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Terminology & Vocabulary Rules</h2>
            {isOwner && (
              <button
                type="button"
                onClick={handleOpenAddTerm}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add Term Rule</span>
              </button>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Term / Keyword</th>
                  <th className="px-6 py-3.5">Required Correction</th>
                  <th className="px-6 py-3.5">Compliance Reason</th>
                  {isOwner && <th className="px-6 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-slate-800">
                {guidelines.terminologyRules.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase ${
                        t.category === 'forbidden' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        t.category === 'mandatory' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-rose-600 font-mono">{t.term}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600 font-mono">{t.correction}</td>
                    <td className="px-6 py-4 text-slate-600">{t.reason}</td>
                    {isOwner && (
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditTerm(t)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTerm(t.id)}
                          className="p-1.5 bg-gray-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Tone of Voice */}
      {activeTab === 'tone' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-3xl space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Tone of Voice Calibration</h2>
          <p className="text-xs text-slate-500">Configure numerical weights for Gemini AI stylistic and linguistic audits.</p>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Formality Level (Casual vs Enterprise Formal)</span>
                <span className="text-indigo-600 font-mono">{guidelines.toneOfVoice.formality}/100</span>
              </div>
              <input
                type="range"
                disabled={!isOwner}
                min="0"
                max="100"
                value={guidelines.toneOfVoice.formality}
                onChange={(e) => {
                  if (!isOwner) return;
                  const val = parseInt(e.target.value);
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, formality: val } }));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Enthusiasm Level (Subdued vs High Energy)</span>
                <span className="text-indigo-600 font-mono">{guidelines.toneOfVoice.enthusiasm}/100</span>
              </div>
              <input
                type="range"
                disabled={!isOwner}
                min="0"
                max="100"
                value={guidelines.toneOfVoice.enthusiasm}
                onChange={(e) => {
                  if (!isOwner) return;
                  const val = parseInt(e.target.value);
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, enthusiasm: val } }));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Technical Depth (Layman Consumer vs Expert Engineering)</span>
                <span className="text-indigo-600 font-mono">{guidelines.toneOfVoice.technicalDepth}/100</span>
              </div>
              <input
                type="range"
                disabled={!isOwner}
                min="0"
                max="100"
                value={guidelines.toneOfVoice.technicalDepth}
                onChange={(e) => {
                  if (!isOwner) return;
                  const val = parseInt(e.target.value);
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, technicalDepth: val } }));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Detailed Tone Guidelines for Gemini Prompt Context</label>
              <textarea
                rows={4}
                readOnly={!isOwner}
                value={guidelines.toneOfVoice.guidelinesText}
                onChange={(e) => {
                  if (!isOwner) return;
                  const val = e.target.value;
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, guidelinesText: val } }));
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            {isOwner && (
              <button
                type="button"
                onClick={() => showToast('Tone guidelines saved.')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow select-none"
              >
                Save Tone Guidelines
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Visual Assets */}
      {activeTab === 'visuals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Visual Assets & Logos</h2>
                {isOwner && <span className="text-xs text-slate-500">Upload logo and reference files in Knowledge.</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidelines.visualAssets.map((asset) => (
              <div key={asset.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden relative group shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-44 bg-gray-100 overflow-hidden relative border-b border-gray-200">
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-white/90 text-indigo-700 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border border-gray-200 uppercase">
                      {asset.type}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{asset.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">Min Clearance: <span className="text-indigo-600 font-semibold">{asset.minClearancePx}px</span></p>
                    {asset.usageGuidelines && <p className="text-xs text-slate-600 pt-2">{asset.usageGuidelines}</p>}
                  </div>
                </div>

                {isOwner && (
                  <div className="p-4 pt-0 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAsset(asset)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        showToast('Asset removal isn’t available yet. No changes were made.');
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Color Palette Studio */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Approved Color Palette Studio</h2>
            {isOwner && (
              <button
                type="button"
                onClick={() => setShowColorModal(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add Color Swatch</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {guidelines.colorPalette.map((color) => (
              <div key={color.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 relative group shadow-sm">
                <div
                  className="h-24 rounded-xl border border-gray-300 shadow-inner"
                  style={{
                    background: color.type === 'gradient'
                      ? `linear-gradient(${color.gradientAngle || 135}deg, ${color.hex}, ${color.gradientStop || '#06b6d4'})`
                      : color.hex
                  }}
                />
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{color.name}</h3>
                    <p className="text-xs text-indigo-600 font-mono font-semibold">{color.hex} {color.type === 'gradient' && `-> ${color.gradientStop}`}</p>
                    <span className="inline-block mt-1 bg-gray-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-semibold border border-gray-200">
                      {color.role} • {color.type}
                    </span>
                  </div>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDeleteColor(color.id)}
                      className="p-1.5 bg-gray-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spec Modal */}
      {showSpecModal && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">{editingSpecId ? 'Edit Product Specification' : 'Add New Product Specification'}</h2>
              <button type="button" onClick={() => setShowSpecModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveSpec} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={specForm.productName}
                  onChange={(e) => setSpecForm({ ...specForm, productName: e.target.value })}
                  placeholder="e.g. Droplet Pod Pro X"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subtitle / Category</label>
                <input
                  type="text"
                  value={specForm.subtitle}
                  onChange={(e) => setSpecForm({ ...specForm, subtitle: e.target.value })}
                  placeholder="e.g. Premium Noise-Canceling Earphones"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Verified Baseline Metric</label>
                <input
                  type="text"
                  required
                  value={specForm.verifiedMetric}
                  onChange={(e) => setSpecForm({ ...specForm, verifiedMetric: e.target.value })}
                  placeholder="e.g. 24-hour continuous playback with ANC"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Allowed Claims (Comma separated)</label>
                <input
                  type="text"
                  value={specForm.allowedClaims}
                  onChange={(e) => setSpecForm({ ...specForm, allowedClaims: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Strictly Forbidden Claims (Comma separated)</label>
                <input
                  type="text"
                  value={specForm.forbiddenClaims}
                  onChange={(e) => setSpecForm({ ...specForm, forbiddenClaims: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Water Resistance Rating</label>
                <input
                  type="text"
                  value={specForm.waterResistanceRating}
                  onChange={(e) => setSpecForm({ ...specForm, waterResistanceRating: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowSpecModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow select-none">Save Specification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terminology Modal */}
      {showTermModal && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">{editingTermId ? 'Edit Terminology Rule' : 'Add Terminology Rule'}</h2>
              <button type="button" onClick={() => setShowTermModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveTerm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={termForm.category}
                  onChange={(e) => setTermForm({ ...termForm, category: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="forbidden">Forbidden Term</option>
                  <option value="mandatory">Mandatory Term</option>
                  <option value="preferred">Preferred Term</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Term / Keyword</label>
                <input
                  type="text"
                  required
                  value={termForm.term}
                  onChange={(e) => setTermForm({ ...termForm, term: e.target.value })}
                  placeholder="e.g. Waterproof"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Required Correction / Alternative</label>
                <input
                  type="text"
                  required
                  value={termForm.correction}
                  onChange={(e) => setTermForm({ ...termForm, correction: e.target.value })}
                  placeholder="e.g. Water-resistant"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Compliance Reason</label>
                <input
                  type="text"
                  required
                  value={termForm.reason}
                  onChange={(e) => setTermForm({ ...termForm, reason: e.target.value })}
                  placeholder="Legal compliance rule"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowTermModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow select-none">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visual Asset Modal */}
      {showAssetModal && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Edit Visual Asset</h2>
              <button type="button" onClick={() => setShowAssetModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Asset Type</label>
                <select
                  value={assetForm.type}
                  onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="logo">Logo</option>
                  <option value="banner">Banner</option>
                  <option value="icon">Icon</option>
                  <option value="typography">Typography</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Min Clearance (px)</label>
                <input
                  type="number"
                  value={assetForm.minClearancePx}
                  onChange={(e) => setAssetForm({ ...assetForm, minClearancePx: parseInt(e.target.value) || 24 })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Usage Guidelines</label>
                <textarea
                  rows={2}
                  value={assetForm.usageGuidelines}
                  onChange={(e) => setAssetForm({ ...assetForm, usageGuidelines: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Replace Asset File / URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      showToast('Image updates aren’t supported yet. Upload the new file to Knowledge.');
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white cursor-pointer"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowAssetModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" disabled={!editingAssetId} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow select-none">Save Asset Details</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Color Swatch Modal */}
      {showColorModal && isOwner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Add Color Swatch / Gradient</h2>
              <button type="button" onClick={() => setShowColorModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddColor} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Swatch Name</label>
                <input
                  type="text"
                  required
                  value={colorForm.name}
                  onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Color Type</label>
                  <select
                    value={colorForm.type}
                    onChange={(e) => setColorForm({ ...colorForm, type: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Palette Role</label>
                  <select
                    value={colorForm.role}
                    onChange={(e) => setColorForm({ ...colorForm, role: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="accent">Accent</option>
                    <option value="background">Background</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={colorForm.hex}
                      onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })}
                      className="w-10 h-10 bg-transparent rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colorForm.hex}
                      onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>

                {colorForm.type === 'gradient' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Gradient Stop</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={colorForm.gradientStop}
                        onChange={(e) => setColorForm({ ...colorForm, gradientStop: e.target.value })}
                        className="w-10 h-10 bg-transparent rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorForm.gradientStop}
                        onChange={(e) => setColorForm({ ...colorForm, gradientStop: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {colorForm.type === 'gradient' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Angle ({colorForm.gradientAngle}°)</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={colorForm.gradientAngle}
                    onChange={(e) => setColorForm({ ...colorForm, gradientAngle: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowColorModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow select-none">Add Swatch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
