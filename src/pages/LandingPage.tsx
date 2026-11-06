import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, ArrowRight, Building2, UserCheck, CheckCircle2, Lock, Cpu, Globe2, BarChart3 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">Droplet AI</span>
              <span className="text-[11px] font-mono text-blue-600">Enterprise Brand Governance</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition select-none"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow select-none"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16 text-center space-y-12">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 px-3.5 py-1.5 rounded-full text-xs text-blue-600 font-semibold shadow-sm">
            <Droplet className="w-3.5 h-3.5 text-blue-600" />
            <span>Enterprise Brand Governance Portal</span>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
              <Droplet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight text-left">
              Droplet AI
            </h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
            Enterprise Brand Governance & Valuation Platform
          </h2>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate non-compliant claims, unverified specifications, and rogue visual branding across marketing, PR, and enterprise channels with Gemini AI verification.
          </p>
        </div>

        {/* 2 Primary Action Cards: Brand Owner vs Employee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Card 1: Brand Owner */}
          <div className="bg-white border border-gray-200 hover:border-slate-900 rounded-2xl p-8 space-y-6 transition group flex flex-col justify-between shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sign In / Register as Brand Owner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Establish master brand rules, product specification limits, terminology blacklists, OpenCV logo safety clearance, and oversee enterprise-wide analytics.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Rule Calibration & AI Setup Assistant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Cross-Brand Portfolio Risk Surveillance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Departmental RBAC & Team Permissions</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { role: 'Brand Owner / Admin' } })}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 shadow select-none"
              >
                <span>Sign In as Brand Owner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/register', { state: { role: 'Brand Owner / Admin' } })}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-slate-700 border border-gray-300 rounded-xl text-xs font-semibold transition text-center block select-none"
              >
                Register Brand Owner Account
              </button>
            </div>
          </div>

          {/* Card 2: Employee */}
          <div className="bg-white border border-gray-200 hover:border-slate-900 rounded-2xl p-8 space-y-6 transition group flex flex-col justify-between shadow-sm hover:shadow-md">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sign In / Register as Employee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Draft collateral, run pre-audit AI contextual checks, submit to Manager approval queues, track personal compliance scores, and publish directly to social media.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pre-Publication Gemini AI Verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>One-Click Social Publishing (X, LinkedIn)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Personal Compliance Rating & Improvement</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { role: 'Content Creator' } })}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 shadow select-none"
              >
                <span>Sign In as Employee</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/register', { state: { role: 'Content Creator' } })}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-slate-700 border border-gray-300 rounded-xl text-xs font-semibold transition text-center block select-none"
              >
                Register Employee Account
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-gray-200">
          <div className="p-4 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
            <Cpu className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Google Gemini API</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Zero-Data-Retention audit</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
            <Lock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-900">2FA OTP Guard</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Enterprise session security</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
            <Globe2 className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Multi-Brand Scoped</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Dynamic brand URL routes</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
            <BarChart3 className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-900">RBAC Analytics</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Tailored creator & admin KPIs</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p>dropletai.domain • Droplet AI Enterprise Brand Governance Platform • Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
};
