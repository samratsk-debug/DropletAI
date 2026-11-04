import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Globe2,
  Users,
  BookOpen,
  CheckSquare,
  FileText,
  Sparkles,
  Settings,
  LogOut,
  ChevronDown,
  UploadCloud,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    team,
    brands,
    selectedBrand,
    setSelectedBrandId,
    isAuthenticated,
    setIsAuthenticated
  } = useApp();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const isOwner = currentUser.role === 'Brand Owner / Admin';

  // Strict required navigation order & routes with brand slug
  const navItems = [
    { to: `/${selectedBrand.slug}/EnterpriseAnalytics`, label: 'Enterprise Analytics', icon: Globe2, ownerOnly: true },
    { to: `/${selectedBrand.slug}/Team`, label: 'Team & RBAC', icon: Users, ownerOnly: false },
    { to: `/${selectedBrand.slug}/BrandGuidelines`, label: 'Brand Guidelines', icon: BookOpen, ownerOnly: false },
    { to: `/${selectedBrand.slug}/ApprovalQueue`, label: 'Approval Queue', icon: CheckSquare, ownerOnly: false },
    { to: `/${selectedBrand.slug}/OCR&Parser`, label: 'OCR & Parser', icon: FileText, ownerOnly: false },
    { to: `/${selectedBrand.slug}/VisualStudio`, label: 'Visual Studio', icon: Sparkles, ownerOnly: false },
    { to: `/${selectedBrand.slug}/Settings`, label: 'Settings', icon: Settings, ownerOnly: false },
  ];

  // If Content Creator / Employee, add MyPerformance
  const employeeNavItems = isOwner ? [] : [
    { to: `/${selectedBrand.slug}/MyPerformance`, label: 'My Performance', icon: BarChart3, ownerOnly: false },
    { to: `/${selectedBrand.slug}/EmployeeWorkspace`, label: 'Upload & Audit', icon: UploadCloud, ownerOnly: false },
  ];

  const allNavs = [...employeeNavItems, ...navItems.filter(item => isOwner || !item.ownerOnly)];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19] border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Selector */}
          <div className="flex items-center space-x-6">
            <div
              onClick={() => navigate(`/${selectedBrand.slug}/EnterpriseAnalytics`)}
              className="flex items-center space-x-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:bg-indigo-500 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-none">Droplet AI</span>
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">Brand Governance</span>
              </div>
            </div>

            {/* Brand Switcher dropdown */}
            <div className="relative hidden md:block">
              <select
                value={selectedBrand.id}
                onChange={(e) => {
                  const b = brands.find(x => x.id === e.target.value);
                  if (b) {
                    setSelectedBrandId(b.id);
                    navigate(`/${b.slug}/BrandGuidelines`);
                  }
                }}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id}>🏢 {b.name} ({b.complianceRate}%)</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* User Profile & Quick Switch */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-3 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-indigo-500" />
              <div className="text-left">
                <p className="text-xs font-medium text-slate-200 leading-none">{currentUser.name}</p>
                <span className="text-[10px] text-indigo-400 font-mono">{currentUser.role}</span>
              </div>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const found = team.find(t => t.id === e.target.value);
                  if (found) setCurrentUser(found);
                }}
                className="bg-transparent text-[11px] text-slate-400 border-l border-slate-700 pl-2 ml-1 focus:outline-none cursor-pointer"
                title="Switch active user role"
              >
                {team.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                    Role: {t.role}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(false);
                navigate('/login');
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Bar Tabs */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/80">
          {allNavs.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition select-none ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
