import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginRegisterAuth: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [email, setEmail] = useState('victoria.v@droplet.ai');
  const [password, setPassword] = useState('SecurePass123!');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('Victoria Vance');
  const [roleType, setRoleType] = useState<'Brand Owner / Admin' | 'Content Creator'>('Brand Owner / Admin');

  // OTP Verification state for register flow
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [resendTimer] = useState(45);

  const { setIsAuthenticated, selectedBrand, team, setCurrentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // If navigated from landing page with state
  React.useEffect(() => {
    if (location.state && (location.state as any).role) {
      setRoleType((location.state as any).role);
      if ((location.state as any).role === 'Content Creator') {
        setEmail('elena.r@droplet.ai');
        setFullName('Elena Rostova');
      }
    }
  }, [location.state]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Login success
      setIsAuthenticated(true);
      const matchedUser = team.find(t => t.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        setCurrentUser(matchedUser);
      }
      navigate(`/${selectedBrand.slug}/EnterpriseAnalytics`);
    } else {
      // Registration requires OTP verification step first
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    // Create new user or sign in
    const newUser = {
      id: 'tm-' + Date.now(),
      name: fullName,
      email,
      role: roleType,
      department: roleType === 'Brand Owner / Admin' ? 'Executive Governance' : 'Copywriting',
      status: 'active' as const,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      personalComplianceScore: 90
    };
    setCurrentUser(newUser);
    navigate(`/${selectedBrand.slug}/EnterpriseAnalytics`);
  };

  const handleGoogleAuth = () => {
    setIsAuthenticated(true);
    navigate(`/${selectedBrand.slug}/EnterpriseAnalytics`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            onClick={() => navigate('/')}
            className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white shadow mb-4 cursor-pointer hover:bg-slate-800 transition"
            title="Return to Landing Page"
          >
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Droplet AI</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">dropletai.domain • Secure Authentication</p>
        </div>

        {step === 'form' ? (
          <div>
            {/* Toggle tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 border border-gray-200">
              <button
                type="button"
                onClick={() => { setIsLogin(true); navigate('/login'); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Sign In (/login)
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); navigate('/register'); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Register (/register)
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    placeholder="Victoria Vance"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Corporate Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Account Role</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Brand Owner / Admin">Brand Owner / Admin</option>
                    <option value="Content Creator">Content Creator / Employee</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow select-none"
              >
                <span>{isLogin ? 'Sign In to Workspace' : 'Continue to Email Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-mono">Or connect with</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full mt-2 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-sm select-none"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google OAuth</span>
              </button>
            </div>
          </div>
        ) : (
          /* OTP Verification Card for Registration */
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-sm font-bold text-slate-900">2FA Email Verification</h2>
              <p className="text-xs text-slate-600">
                Verification code sent to <span className="text-indigo-600 font-mono font-medium">{email}</span>. (Enter mock OTP: <span className="text-emerald-700 font-mono font-bold">123456</span>)
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-center space-x-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otpCode];
                      newOtp[idx] = e.target.value;
                      setOtpCode(newOtp);
                    }}
                    className="w-12 h-12 bg-white border border-gray-300 rounded-xl text-center text-lg font-mono text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm"
                  />
                ))}
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-500">Resend code in {resendTimer}s</span>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow select-none"
              >
                <span>Verify & Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-slate-500">Secure JWT Session • Supabase Enterprise Vault</p>
        </div>
      </div>
    </div>
  );
};
