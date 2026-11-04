import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthOnboarding: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('victoria.v@droplet.ai');
  const [password, setPassword] = useState('••••••••');
  const [orgName, setOrgName] = useState('Droplet Global Enterprises');
  const [step, setStep] = useState<'auth' | 'workspace'>('auth');
  const { setIsAuthenticated } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      setIsAuthenticated(true);
      navigate('/upload');
    } else {
      setStep('workspace');
    }
  };

  const handleFinishWorkspace = () => {
    setIsAuthenticated(true);
    navigate('/brand-setup');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Droplet AI</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Enterprise Brand Governance Platform</p>
        </div>

        {step === 'auth' ? (
          <div>
            <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${isLogin ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${!isLogin ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Organization Signup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      defaultValue="Victoria Vance"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Victoria Vance"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 select-none"
              >
                <span>{isLogin ? 'Sign In to Workspace' : 'Continue to Workspace Setup'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
              <Building2 className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
              <h2 className="text-sm font-semibold text-white">Create Enterprise Organization</h2>
              <p className="text-xs text-slate-400 mt-1">Set up your brand guidelines database and secure audit gateway.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Industry Vertical</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer">
                  <option>Consumer Electronics & Hardware</option>
                  <option>Enterprise Cloud & SaaS</option>
                  <option>Financial Services & Fintech</option>
                  <option>Healthcare & Pharma</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleFinishWorkspace}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 select-none"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Initialize Brand Guidelines</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">Secure JWT Session • Supabase Enterprise Vault • Gemini API Enabled</p>
        </div>
      </div>
    </div>
  );
};
