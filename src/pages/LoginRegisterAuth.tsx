import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, getAdditionalUserInfo, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import { ApiError, api, saveAuthSession } from '../api';
import { firebaseAuth, googleProvider } from '../firebase';
import { ThemeToggle } from '../components/ThemeToggle';

function friendlyAuthError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  const message = error instanceof Error ? error.message : 'Could not sign in. Please try again.';

  if (error instanceof ApiError) return error.message;
  if (code === 'auth/operation-not-allowed') return 'This sign-in method is not enabled in Firebase Authentication yet.';
  if (code === 'auth/unauthorized-domain') return 'Add localhost to Firebase Authentication → Settings → Authorized domains.';
  if (code === 'auth/email-already-in-use') return 'An account already uses this email. Choose Sign In instead.';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return 'Email or password is incorrect.';
  if (code === 'auth/popup-closed-by-user') return 'The Google sign-in window was closed before finishing.';
  if (code === 'auth/popup-blocked') return 'Your browser blocked the Google sign-in window. Allow popups and try again.';
  if (code === 'auth/network-request-failed') return 'Firebase could not be reached. Check your connection and try again.';
  if (code.startsWith('auth/')) return message.replace(/^Firebase:s*/i, '');
  return message;
}

export const LoginRegisterAuth: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authNotice, setAuthNotice] = useState('');

  const { setIsAuthenticated, setCurrentUser, setSelectedBrandId } = useApp();
  const navigate = useNavigate();

  const openWorkspace = async (session: Awaited<ReturnType<typeof api.firebaseSignIn>>, isNewAccount: boolean) => {
      saveAuthSession(session);
      const backendRole = session.role === 'OWNER'
        ? 'Brand Owner / Admin'
        : session.role === 'ADMIN' ? 'Admin'
        : session.role === 'MARKETING_MANAGER'
          ? 'Marketing Manager'
          : session.role === 'REVIEWER'
            ? 'Authorised Reviewer'
            : 'Content Creator';
      setCurrentUser({
        id: session.userId,
        name: session.fullName,
        email: session.email,
        role: backendRole,
        department: 'General',
        status: 'active',
        avatar: ''
      });
      setIsAuthenticated(true);
      let existingBrands;
      try {
        existingBrands = await api.getBrands(session.organisationId);
      } catch {
        setAuthNotice('Signed in, but we could not load your workspaces. You can retry by refreshing.');
        navigate(`/${session.organisationId}/Home`);
        return;
      }
      if (existingBrands.length === 0) {
        navigate(`/${session.organisationId}/Home`);
      } else if (existingBrands.length) {
        const brand = existingBrands[0];
        setSelectedBrandId(brand.id);
        navigate(`/${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${isNewAccount ? 'BrandGuidelines' : 'EnterpriseAnalytics'}`);
      } else {
        navigate(`/${session.organisationId}/Home`);
      }
  };

  const finishFirebaseSignIn = async (
    user: import('firebase/auth').User,
    options: { isNewAccount: boolean; fullName?: string; organisationName?: string }
  ) => {
    const idToken = await user.getIdToken(true);
    const session = await api.firebaseSignIn({
      idToken,
      ...(options.fullName ? { fullName: options.fullName } : {}),
      ...(options.organisationName ? { organisationName: options.organisationName } : {}),
    });
    await openWorkspace(session, options.isNewAccount);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');
    if (!isLogin && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      const credential = isLogin
        ? await signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
        : await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      if (!isLogin) {
        await updateProfile(credential.user, { displayName: fullName.trim() });
      }
      await finishFirebaseSignIn(credential.user, {
        isNewAccount: !isLogin,
        ...(!isLogin ? { fullName: fullName.trim(), organisationName: organisationName.trim() } : {}),
      });
    } catch (error) {
      if (error instanceof ApiError && error.message.includes('Verify your email in Firebase')) {
        const firebaseUser = firebaseAuth.currentUser;
        if (firebaseUser && !firebaseUser.emailVerified) {
          try {
            await sendEmailVerification(firebaseUser);
            setAuthNotice(`We sent a verification link to ${firebaseUser.email}. Verify it, then sign in again to connect your existing workspace.`);
          } catch (verificationError) {
            setAuthError(friendlyAuthError(verificationError));
          }
        } else {
          setAuthError(error.message);
        }
      } else {
        setAuthError(friendlyAuthError(error));
      }
      await signOut(firebaseAuth).catch(() => undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setAuthNotice('');
    setIsSubmitting(true);
    try {
      const credential = await signInWithPopup(firebaseAuth, googleProvider);
      const isNewAccount = getAdditionalUserInfo(credential)?.isNewUser ?? false;
      await finishFirebaseSignIn(credential.user, { isNewAccount });
    } catch (error) {
      setAuthError(friendlyAuthError(error));
      await signOut(firebaseAuth).catch(() => undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page min-h-screen bg-gray-50 text-slate-900 flex items-center justify-center p-4">
      <div className="auth-card relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/30 p-8">
        <div className="absolute right-4 top-4"><ThemeToggle compact /></div>
        {/* Header */}
        <div className="auth-card-header text-center mb-6">
          <div
            onClick={() => navigate('/')}
            className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white shadow mb-4 cursor-pointer hover:bg-slate-800 transition"
            title="Return to Landing Page"
          >
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Droplet AI</h1>
          <p className="auth-card-subtitle text-sm text-slate-600 mt-2">{isLogin ? 'Pick up where you left off.' : 'A clearer way to protect your brand starts here.'}</p>
        </div>

        <div>
            {/* Toggle tabs */}
            <div className="auth-mode-tabs flex bg-gray-100 p-1 rounded-xl mb-6 border border-gray-200" data-mode={isLogin ? 'login' : 'register'} role="group" aria-label="Choose sign in or account creation">
              <span className="auth-mode-indicator" aria-hidden="true" />
              <button
                type="button"
                onClick={() => { setIsLogin(true); navigate('/login', { state: location.state }); }}
                aria-pressed={isLogin}
                className={`auth-mode-tab flex-1 py-2 text-sm font-semibold ${isLogin ? 'is-active' : ''}`}
              >
                  Sign in
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); navigate('/register', { state: location.state }); }}
                aria-pressed={!isLogin}
                className={`auth-mode-tab flex-1 py-2 text-sm font-semibold ${!isLogin ? 'is-active' : ''}`}
              >
                  Create account
              </button>
            </div>

            <form key={isLogin ? 'login-form' : 'register-form'} onSubmit={handleAuthSubmit} className="auth-form space-y-4">
              {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-indigo-600"
                    placeholder="Victoria Vance"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Workspace name</label>
                  <input
                    type="text"
                    required
                    value={organisationName}
                    onChange={(e) => setOrganisationName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-indigo-600"
                    placeholder="Your company"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-indigo-600"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={isLogin ? undefined : 8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-indigo-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-indigo-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {(authError || authNotice) && <p role={authError ? 'alert' : 'status'} className={`rounded-lg border px-3 py-2 text-xs ${authError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>{authError || authNotice}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="auth-submit w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow select-none"
              >
                <span>{isSubmitting ? 'Connecting…' : isLogin ? 'Sign in to your workspace' : 'Create your workspace'}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 bg-white border border-gray-300 text-slate-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-sm select-none disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isSubmitting ? 'Connecting…' : 'Continue with Google'}</span>
              </button>
            </div>
        </div>

        <div className="auth-card-footer mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-slate-600">{isLogin ? 'Your workspace is right where you left it.' : 'One workspace for everything your brand needs.'}</p>
        </div>
      </div>
    </div>
  );
};
