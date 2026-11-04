import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Building2, UserCheck, Sparkles, CheckCircle2, Lock, Cpu, Globe2, BarChart3 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Top Bar with Domain Identifier */}
      <header className="border-b border-slate-800 bg-[#0f172a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">Droplet AI</span>
              <span className="text-[11px] font-mono text-indigo-400">dropletai.domain</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition select-none"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/20 select-none"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16 text-center space-y-12">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs text-indigo-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Contextual Brand Governance v2.4</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Centralize Brand Identity. <br />
            <span className="text-indigo-400">Automate AI Audits Pre-Publication.</span>
          </h1>

          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate non-compliant claims, unverified specifications, and rogue visual branding across marketing, PR, and enterprise channels with Gemini AI verification.
          </p>
        </div>

        {/* 2 Primary Action Cards: Brand Owner vs Employee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Card 1: Brand Owner */}
          <div className="bg-slate-900 border-2 border-slate-800 hover:border-indigo-500 rounded-3xl p-8 space-y-6 transition group flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
                <Building2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Brand Owner / Executive Admin</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Establish master brand rules, product specification limits, terminology blacklists, OpenCV logo safety clearance, and oversee enterprise-wide analytics.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Rule Calibration & AI Setup Assistant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Cross-Brand Portfolio Risk Surveillance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Departmental RBAC & Team Permissions</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { role: 'Brand Owner / Admin' } })}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 select-none"
              >
                <span>Login as Brand Owner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/register', { state: { role: 'Brand Owner / Admin' } })}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition text-center block select-none"
              >
                Register Brand Owner Account
              </button>
            </div>
          </div>

          {/* Card 2: Employee */}
          <div className="bg-slate-900 border-2 border-slate-800 hover:border-indigo-500 rounded-3xl p-8 space-y-6 transition group flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
                <UserCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Employee & Marketing Creator</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Draft collateral, run pre-audit AI contextual checks, submit to Manager approval queues, track personal compliance scores, and publish directly to social media.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Pre-Publication Gemini AI Verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>One-Click Social Publishing (X, LinkedIn)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Personal Compliance Rating & Improvement</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { role: 'Content Creator' } })}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 select-none"
              >
                <span>Login as Employee</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/register', { state: { role: 'Content Creator' } })}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition text-center block select-none"
              >
                Register Employee Account
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <Cpu className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-white">Google Gemini API</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero-Data-Retention audit</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <Lock className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-white">2FA OTP Guard</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Enterprise session security</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <Globe2 className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-white">Multi-Brand Scoped</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Dynamic brand URL routes</p>
          </div>
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <BarChart3 className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-white">RBAC Analytics</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Tailored creator & admin KPIs</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-[#0f172a]">
        <p>dropletai.domain • Droplet AI Enterprise Brand Governance Platform • Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
};
