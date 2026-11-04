import React, { useState } from 'react';
import { Settings, Shield, Key, Database, Cpu, CheckCircle2, Lock } from 'lucide-react';

export const SecurityApiSettings: React.FC = () => {
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [geminiZeroDataRetention, setGeminiZeroDataRetention] = useState(true);
  const [supabaseBucketEncryption, setSupabaseBucketEncryption] = useState(true);
  const [postgresSyncStatus, setPostgresSyncStatus] = useState<'Synchronized' | 'Syncing'>('Synchronized');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    showToast('Enterprise security configurations applied successfully.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Security, Privacy & API Administration Settings</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage JWT authentication tokens, Supabase bucket policies, and Google Gemini API privacy guarantees.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-indigo-600/20 select-none"
          >
            Save Security Policies
          </button>
        </div>
      </div>

      {toast && (
        <div className="mb-6 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* JWT Session Security */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Authentication & JWT Session Expiry</h2>
          </div>
          <p className="text-xs text-slate-400">Configure corporate JWT bearer token time-to-live (TTL) and idle revocation thresholds.</p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Session Timeout Threshold</span>
              <span className="text-indigo-400 font-mono">{sessionTimeoutMinutes} minutes</span>
            </div>
            <input
              type="range"
              min="15"
              max="240"
              step="15"
              value={sessionTimeoutMinutes}
              onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Gemini AI Privacy Policy & Zero Retention */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Google Gemini API Enterprise Data Governance</h2>
          </div>
          <p className="text-xs text-slate-400">Enforce enterprise zero-data-retention (ZDR) guarantees for all marketing collateral payloads.</p>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Strict Zero-Data-Retention (ZDR)</span>
              <span className="text-[11px] text-slate-400">Prohibit customer collateral from being stored or used for LLM foundation training.</span>
            </div>
            <button
              type="button"
              onClick={() => setGeminiZeroDataRetention(!geminiZeroDataRetention)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer select-none ${
                geminiZeroDataRetention ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  geminiZeroDataRetention ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Supabase Storage & PostgreSQL Synchronization */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Storage Buckets & PostgreSQL State</h2>
          </div>
          <p className="text-xs text-slate-400">Supabase Storage AES-256 server-side encryption and relational audit synchronization.</p>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">AES-256 Storage Bucket Encryption</span>
              <span className="text-[11px] text-slate-400">All marketing collateral PDFs, images, and documents are encrypted at rest.</span>
            </div>
            <button
              type="button"
              onClick={() => setSupabaseBucketEncryption(!supabaseBucketEncryption)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer select-none ${
                supabaseBucketEncryption ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  supabaseBucketEncryption ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">PostgreSQL Replicated Audit Ledger</span>
              <span className="text-[11px] text-slate-400">Multi-region read replicas for low-latency governance queries.</span>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold">
              {postgresSyncStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
