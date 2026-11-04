import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Sliders, Palette, FileCode, CheckCircle, Shield, Edit3, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BrandSetup: React.FC = () => {
  const { guidelines, updateGuidelines } = useApp();
  const [activeTab, setActiveTab] = useState<'specs' | 'terminology' | 'tone' | 'visuals' | 'colors'>('specs');
  const [toast, setToast] = useState<string | null>(null);

  // Modal states for editing or adding
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

  // AI Assistant Drawer state
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('We are launching a new noise-canceling earbud with 30-hour battery. Add forbidden claims for water immersion above 2m.');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Spec handlers
  const handleOpenAddSpec = () => {
    setEditingSpecId(null);
    setSpecForm({ productName: '', subtitle: '', verifiedMetric: '', allowedClaims: '', forbiddenClaims: '', waterResistanceRating: 'IPX7' });
    setShowSpecModal(true);
  };

  const handleOpenEditSpec = (spec: any) => {
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

  const handleSaveSpec = (e: React.FormEvent) => {
    e.preventDefault();
    const allowed = specForm.allowedClaims.split(',').map(s => s.trim()).filter(Boolean);
    const forbidden = specForm.forbiddenClaims.split(',').map(s => s.trim()).filter(Boolean);

    if (editingSpecId) {
      updateGuidelines(prev => ({
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
      showToast('Product specification updated successfully');
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
      updateGuidelines(prev => ({ ...prev, productSpecs: [...prev.productSpecs, newSpec] }));
      showToast('New product specification added');
    }
    setShowSpecModal(false);
  };

  const handleDeleteSpec = (id: string) => {
    updateGuidelines(prev => ({ ...prev, productSpecs: prev.productSpecs.filter(s => s.id !== id) }));
    showToast('Specification deleted');
  };

  // Terminology handlers
  const handleOpenAddTerm = () => {
    setEditingTermId(null);
    setTermForm({ term: '', correction: '', reason: '', category: 'forbidden', context: '' });
    setShowTermModal(true);
  };

  const handleOpenEditTerm = (t: any) => {
    setEditingTermId(t.id);
    setTermForm({ term: t.term, correction: t.correction, reason: t.reason, category: t.category, context: t.context || '' });
    setShowTermModal(true);
  };

  const handleSaveTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTermId) {
      updateGuidelines(prev => ({
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
      showToast('Terminology rule updated');
    } else {
      const newTr = {
        id: 'term-' + Date.now(),
        term: termForm.term,
        correction: termForm.correction,
        reason: termForm.reason,
        category: termForm.category,
        context: termForm.context
      };
      updateGuidelines(prev => ({ ...prev, terminologyRules: [...prev.terminologyRules, newTr] }));
      showToast('Terminology rule added');
    }
    setShowTermModal(false);
  };

  const handleDeleteTerm = (id: string) => {
    updateGuidelines(prev => ({ ...prev, terminologyRules: prev.terminologyRules.filter(t => t.id !== id) }));
    showToast('Terminology rule removed');
  };

  // Color Palette handlers
  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    const newColor = {
      id: 'c-' + Date.now(),
      name: colorForm.name,
      hex: colorForm.hex,
      type: colorForm.type,
      gradientStop: colorForm.gradientStop,
      gradientAngle: colorForm.gradientAngle,
      role: colorForm.role
    };
    updateGuidelines(prev => ({ ...prev, colorPalette: [...prev.colorPalette, newColor] }));
    setShowColorModal(false);
    showToast('Color swatch added to palette');
  };

  const handleDeleteColor = (id: string) => {
    updateGuidelines(prev => ({ ...prev, colorPalette: prev.colorPalette.filter(c => c.id !== id) }));
    showToast('Color swatch removed');
  };

  // AI Rule Setup Assistant simulator
  const handleRunAiAssistant = () => {
    setAiResponse('Analyzing prompt against enterprise guidelines... Added new specification "Droplet Earbud Pro" with 30h battery limit and forbidden claims for water immersion > 2m.');
    updateGuidelines(prev => ({
      ...prev,
      productSpecs: [
        ...prev.productSpecs,
        {
          id: 'spec-ai-' + Date.now(),
          productName: 'Droplet Earbud Pro',
          subtitle: 'AI Setup Assistant Generated',
          verifiedMetric: '30-hour continuous playback with ANC',
          allowedClaims: ['30h battery life', 'Active Noise Canceling'],
          forbiddenClaims: ['Water immersion above 2m', 'Infinite submersion'],
          maxBatteryLifeHours: 30,
          waterResistanceRating: 'IPX5 (Splash resistant)'
        }
      ]
    }));
    showToast('AI Assistant successfully applied new guidelines to state!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Brand Guidelines & Knowledge Base</h1>
              <p className="text-xs text-slate-400 mt-0.5">Centralized repository for verified specs, terminology rules, tone sliders, visual assets, and color palettes.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowAiDrawer(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center space-x-2 shadow-lg shadow-indigo-600/20 select-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Rule Setup Assistant</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
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
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap select-none ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
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
            <h2 className="text-lg font-semibold text-white">Verified Product Specifications</h2>
            <button
              type="button"
              onClick={handleOpenAddSpec}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center space-x-1.5 shadow select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Specification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.productSpecs.map((spec) => (
              <div key={spec.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{spec.productName}</h3>
                    {spec.subtitle && <p className="text-xs text-slate-400">{spec.subtitle}</p>}
                    <p className="text-xs text-indigo-400 font-mono mt-1">{spec.waterResistanceRating}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSpec(spec)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      title="Edit specification"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpec(spec.id)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition"
                      title="Delete specification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block font-medium mb-1">Verified Baseline Metric</span>
                    <span className="text-slate-200 font-mono">{spec.verifiedMetric}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium mb-1">Allowed Claims</span>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.allowedClaims.map((ac, idx) => (
                        <span key={idx} className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg">
                          ✓ {ac}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium mb-1">Strictly Forbidden Claims</span>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.forbiddenClaims.map((fc, idx) => (
                        <span key={idx} className="bg-rose-950/60 border border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-lg">
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
            <h2 className="text-lg font-semibold text-white">Terminology & Vocabulary Rules</h2>
            <button
              type="button"
              onClick={handleOpenAddTerm}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center space-x-1.5 shadow select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Term Rule</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Term / Keyword</th>
                  <th className="px-6 py-3.5">Required Correction</th>
                  <th className="px-6 py-3.5">Compliance Reason</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {guidelines.terminologyRules.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase ${
                        t.category === 'forbidden' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                        t.category === 'mandatory' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30' :
                        'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-rose-400 font-mono">{t.term}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-400 font-mono">{t.correction}</td>
                    <td className="px-6 py-4 text-slate-400">{t.reason}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditTerm(t)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                        title="Edit term rule"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTerm(t.id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded transition"
                        title="Delete term rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Tone of Voice */}
      {activeTab === 'tone' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl space-y-6">
          <h2 className="text-lg font-semibold text-white">Tone of Voice Calibration</h2>
          <p className="text-xs text-slate-400">Configure numerical weights for Gemini AI stylistic and linguistic audits.</p>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Formality Level (Casual vs Enterprise Formal)</span>
                <span className="text-indigo-400 font-mono">{guidelines.toneOfVoice.formality}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={guidelines.toneOfVoice.formality}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, formality: val } }));
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Enthusiasm Level (Subdued vs High Energy)</span>
                <span className="text-indigo-400 font-mono">{guidelines.toneOfVoice.enthusiasm}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={guidelines.toneOfVoice.enthusiasm}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, enthusiasm: val } }));
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Technical Depth (Layman Consumer vs Expert Engineering)</span>
                <span className="text-indigo-400 font-mono">{guidelines.toneOfVoice.technicalDepth}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={guidelines.toneOfVoice.technicalDepth}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, technicalDepth: val } }));
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-300 mb-2">Detailed Tone Guidelines for Gemini Prompt Context</label>
              <textarea
                rows={4}
                value={guidelines.toneOfVoice.guidelinesText}
                onChange={(e) => {
                  const val = e.target.value;
                  updateGuidelines(prev => ({ ...prev, toneOfVoice: { ...prev.toneOfVoice, guidelinesText: val } }));
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => showToast('Tone calibration updated successfully')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-indigo-600/20 select-none"
            >
              Save Tone Guidelines
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Visual Assets */}
      {activeTab === 'visuals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Visual Assets & Logos</h2>
            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer shadow select-none">
              <Plus className="w-4 h-4" />
              <span>Upload New Asset</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const newAsset = {
                      id: 'va-' + Date.now(),
                      name: file.name,
                      type: 'logo' as const,
                      url: URL.createObjectURL(file),
                      minClearancePx: 24
                    };
                    updateGuidelines(prev => ({ ...prev, visualAssets: [...prev.visualAssets, newAsset] }));
                    showToast(`Successfully uploaded asset: ${file.name}`);
                  }
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidelines.visualAssets.map((asset) => (
              <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative group">
                <div className="h-40 bg-slate-950 overflow-hidden relative">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-slate-900/90 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 uppercase">
                    {asset.type}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{asset.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Min Clearance: <span className="text-indigo-400">{asset.minClearancePx}px</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateGuidelines(prev => ({ ...prev, visualAssets: prev.visualAssets.filter(a => a.id !== asset.id) }));
                      showToast('Asset deleted from library');
                    }}
                    className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition"
                    title="Delete visual asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Color Palette Studio */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Approved Color Palette Studio</h2>
            <button
              type="button"
              onClick={() => setShowColorModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center space-x-1.5 shadow select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Color Swatch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {guidelines.colorPalette.map((color) => (
              <div key={color.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative group">
                <div
                  className="h-24 rounded-xl border border-slate-700 shadow-inner"
                  style={{
                    background: color.type === 'gradient'
                      ? `linear-gradient(${color.gradientAngle || 135}deg, ${color.hex}, ${color.gradientStop || '#06b6d4'})`
                      : color.hex
                  }}
                />
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">{color.name}</h3>
                    <p className="text-xs text-indigo-400 font-mono">{color.hex} {color.type === 'gradient' && `-> ${color.gradientStop}`}</p>
                    <span className="inline-block mt-1 bg-slate-950 text-slate-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-slate-800">
                      {color.role} • {color.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteColor(color.id)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spec Modal */}
      {showSpecModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingSpecId ? 'Edit Product Specification' : 'Add New Product Specification'}</h2>
              <button type="button" onClick={() => setShowSpecModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveSpec} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={specForm.productName}
                  onChange={(e) => setSpecForm({ ...specForm, productName: e.target.value })}
                  placeholder="e.g. Droplet Pod Pro X"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subtitle / Category</label>
                <input
                  type="text"
                  value={specForm.subtitle}
                  onChange={(e) => setSpecForm({ ...specForm, subtitle: e.target.value })}
                  placeholder="e.g. Premium Noise-Canceling Earphones"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Verified Baseline Metric</label>
                <input
                  type="text"
                  required
                  value={specForm.verifiedMetric}
                  onChange={(e) => setSpecForm({ ...specForm, verifiedMetric: e.target.value })}
                  placeholder="e.g. 24-hour continuous playback with ANC"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Allowed Claims (Comma separated)</label>
                <input
                  type="text"
                  value={specForm.allowedClaims}
                  onChange={(e) => setSpecForm({ ...specForm, allowedClaims: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Strictly Forbidden Claims (Comma separated)</label>
                <input
                  type="text"
                  value={specForm.forbiddenClaims}
                  onChange={(e) => setSpecForm({ ...specForm, forbiddenClaims: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Water Resistance Rating</label>
                <input
                  type="text"
                  value={specForm.waterResistanceRating}
                  onChange={(e) => setSpecForm({ ...specForm, waterResistanceRating: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowSpecModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium shadow select-none">Save Specification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terminology Modal */}
      {showTermModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingTermId ? 'Edit Terminology Rule' : 'Add Terminology Rule'}</h2>
              <button type="button" onClick={() => setShowTermModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveTerm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={termForm.category}
                  onChange={(e) => setTermForm({ ...termForm, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="forbidden">Forbidden Term</option>
                  <option value="mandatory">Mandatory Term</option>
                  <option value="preferred">Preferred Term</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Term / Keyword</label>
                <input
                  type="text"
                  required
                  value={termForm.term}
                  onChange={(e) => setTermForm({ ...termForm, term: e.target.value })}
                  placeholder="e.g. Waterproof"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Required Correction / Alternative</label>
                <input
                  type="text"
                  required
                  value={termForm.correction}
                  onChange={(e) => setTermForm({ ...termForm, correction: e.target.value })}
                  placeholder="e.g. Water-resistant"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Compliance Reason</label>
                <input
                  type="text"
                  required
                  value={termForm.reason}
                  onChange={(e) => setTermForm({ ...termForm, reason: e.target.value })}
                  placeholder="Legal compliance rule"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowTermModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium shadow select-none">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Color Swatch Modal */}
      {showColorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add Color Swatch / Gradient</h2>
              <button type="button" onClick={() => setShowColorModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddColor} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Swatch Name</label>
                <input
                  type="text"
                  required
                  value={colorForm.name}
                  onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Color Type</label>
                  <select
                    value={colorForm.type}
                    onChange={(e) => setColorForm({ ...colorForm, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Palette Role</label>
                  <select
                    value={colorForm.role}
                    onChange={(e) => setColorForm({ ...colorForm, role: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Color / Stop</label>
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                {colorForm.type === 'gradient' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Gradient Stop Color</label>
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
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {colorForm.type === 'gradient' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gradient Angle ({colorForm.gradientAngle}°)</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={colorForm.gradientAngle}
                    onChange={(e) => setColorForm({ ...colorForm, gradientAngle: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowColorModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium select-none">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium shadow select-none">Add Swatch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Rule Setup Assistant Drawer */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-base font-bold text-white">AI Rule Setup Assistant</h2>
              </div>
              <button type="button" onClick={() => setShowAiDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Prompt Gemini AI in natural language to instantly generate and calibrate product specifications, terminology rules, and tone criteria.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Natural Language Prompt</label>
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleRunAiAssistant}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition shadow flex items-center justify-center space-x-2 select-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply AI Suggestions to Guidelines</span>
              </button>

              {aiResponse && (
                <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 space-y-1">
                  <span className="font-bold text-indigo-400 block">AI Execution Result:</span>
                  <p>{aiResponse}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500">Gemini 5.5 Pro Enterprise Context Engine</span>
          </div>
        </div>
      )}
    </div>
  );
};
