import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';

// Landing & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginRegisterAuth } from './pages/LoginRegisterAuth';
import { BrandHomeHub } from './pages/BrandHomeHub';

// Core & Extended Pages with Brand Slug Routing
import { EnterpriseAnalytics } from './pages/EnterpriseAnalytics';
import { AnalyticsGraph } from './pages/AnalyticsGraph';
import { TeamManagement } from './pages/TeamManagement';
import { BrandSetup } from './pages/BrandSetup';
import { ReviewerQueue } from './pages/ReviewerQueue';
import { AIBrandReview } from './pages/AIBrandReview';
import { SecurityApiSettings } from './pages/SecurityApiSettings';
import { EmployeeWorkspace } from './pages/EmployeeWorkspace';
import { EmployeePerformance } from './pages/EmployeePerformance';
import { ContentAuditReport } from './pages/ContentAuditReport';
import { ContentUpload } from './pages/ContentUpload';

const AppContent: React.FC = () => {
  const { isAuthenticated, selectedBrand, isLoadingWorkspace, apiError, clearApiError } = useApp();
  const location = useLocation();

  // Hide Navbar on unauthenticated landing page root "/"
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col font-sans">
      {!isLandingPage && <Navbar />}
      <main className="flex-1 w-full">
        {apiError && isAuthenticated && (
          <div role="alert" className="max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <p>{apiError}</p>
              <button type="button" onClick={clearApiError} className="shrink-0 font-semibold">Dismiss</button>
            </div>
          </div>
        )}
        <Routes>
          {/* Landing page at root */}
          <Route path="/" element={<LandingPage />} />

          {/* Separate Login and Register routes with OTP verification */}
          <Route path="/login" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <Navigate to={`/${selectedBrand.slug}/${selectedBrand.id ? 'EnterpriseAnalytics' : 'Home'}`} />) : <LoginRegisterAuth initialMode="login" />} />
          <Route path="/register" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <Navigate to={`/${selectedBrand.slug}/${selectedBrand.id ? 'EnterpriseAnalytics' : 'Home'}`} />) : <LoginRegisterAuth initialMode="register" />} />

          {/* Brand-Scoped Dynamic Routes */}
          <Route path="/:brandSlug/Home" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <BrandHomeHub />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/EnterpriseAnalytics" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <EnterpriseAnalytics />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/AnalyticsGraph" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <AnalyticsGraph />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/Team" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <TeamManagement />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/BrandGuidelines" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <BrandSetup />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/ApprovalQueue" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <ReviewerQueue />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/AIBrandReview" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <AIBrandReview />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/Settings" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <SecurityApiSettings />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/Upload" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <ContentUpload />) : <Navigate to="/login" />} />
          <Route path="/upload" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <ContentUpload />) : <Navigate to="/login" />} />

          {/* Employee specific routes */}
          <Route path="/:brandSlug/EmployeeWorkspace" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <EmployeeWorkspace />) : <Navigate to="/login" />} />
          <Route path="/:brandSlug/MyPerformance" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <EmployeePerformance />) : <Navigate to="/login" />} />

          {/* Audit report view */}
          <Route path="/audit/:id" element={isAuthenticated ? (isLoadingWorkspace ? <p className="p-8 text-center text-sm text-slate-500">Loading your workspace…</p> : <ContentAuditReport />) : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? `/${selectedBrand.slug}/Home` : "/"} />} />
        </Routes>
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
