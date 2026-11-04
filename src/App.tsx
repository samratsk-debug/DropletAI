import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';

// Landing & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginRegisterAuth } from './pages/LoginRegisterAuth';

// Core & Extended Pages with Brand Slug Routing
import { EnterpriseAnalytics } from './pages/EnterpriseAnalytics';
import { TeamManagement } from './pages/TeamManagement';
import { BrandSetup } from './pages/BrandSetup';
import { ReviewerQueue } from './pages/ReviewerQueue';
import { DocumentOCRWorkspace } from './pages/DocumentOCRWorkspace';
import { VisualIdentityStudio } from './pages/VisualIdentityStudio';
import { SecurityApiSettings } from './pages/SecurityApiSettings';
import { EmployeeWorkspace } from './pages/EmployeeWorkspace';
import { EmployeePerformance } from './pages/EmployeePerformance';
import { ContentAuditReport } from './pages/ContentAuditReport';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, selectedBrand } = useApp();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          {/* Landing page at root */}
          <Route path="/" element={<LandingPage />} />

          {/* Separate Login and Register routes with OTP verification */}
          <Route path="/login" element={<LoginRegisterAuth initialMode="login" />} />
          <Route path="/register" element={<LoginRegisterAuth initialMode="register" />} />

          {/* Brand-Scoped Dynamic Routes */}
          <Route path="/:brandSlug/EnterpriseAnalytics" element={isAuthenticated ? <EnterpriseAnalytics /> : <Navigate to="/login" />} />
          <Route path="/:brandSlug/Team" element={isAuthenticated ? <TeamManagement /> : <Navigate to="/login" />} />
          <Route path="/:brandSlug/BrandGuidelines" element={isAuthenticated ? <BrandSetup /> : <Navigate to="/login" />} />
          <Route path="/:brandSlug/ApprovalQueue" element={isAuthenticated ? <ReviewerQueue /> : <Navigate to="/login" />} />
          <Route path="/:brandSlug/OCR&Parser" element={isAuthenticated ? <DocumentOCRWorkspace /> : <Navigate to="/login" />} />
          <Route path="/:brandSlug/VisualStudio" element={isAuthenticated ? <VisualIdentityStudio /> : <Navigate to="/login" />} />
          <Route path="/:brandSlug/Settings" element={isAuthenticated ? <SecurityApiSettings /> : <Navigate to="/login" />} />

          {/* Employee specific routes */}
          <Route path="/:brandSlug/EmployeeWorkspace" element={isAuthenticated ? <EmployeeWorkspace /> : <Navigate to="/login" />} />
          <Route path="/:brandSlug/MyPerformance" element={isAuthenticated ? <EmployeePerformance /> : <Navigate to="/login" />} />

          {/* Audit report view */}
          <Route path="/audit/:id" element={isAuthenticated ? <ContentAuditReport /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? `/${selectedBrand.slug}/EnterpriseAnalytics` : "/"} />} />
        </Routes>
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
