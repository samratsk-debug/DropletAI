import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Home,
  Globe2,
  BarChart3,
  Users,
  BookOpen,
  CheckSquare,
  ClipboardCheck,
  Sparkles,
  Settings,
  LogOut,
  ChevronDown,
  UploadCloud,
  MessageSquare,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    brands,
    selectedBrand,
    setSelectedBrandId,
    isAuthenticated,
    setIsAuthenticated,
    guidelines
  } = useApp();
  const navigate = useNavigate();

  const [showAiChatDrawer, setShowAiChatDrawer] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I am your Gemini AI Assistant. How can I help you inspect brand guidelines, check compliance claims, or draft marketing copy today?`,
      timestamp: 'Just now'
    }
  ]);

  if (!isAuthenticated) return null;

  const isOwner = currentUser.role === 'Brand Owner / Admin';

  // Navigation order: Home -> Enterprise Analytics -> Analytics Graph -> AI Brand Review -> Team & RBAC -> Brand Guidelines -> Approval Queue -> Settings
  const baseNavItems = [
    { to: `/${selectedBrand.slug}/Home`, label: 'Home', icon: Home, ownerOnly: false },
    { to: `/${selectedBrand.slug}/EnterpriseAnalytics`, label: 'Enterprise Analytics', icon: Globe2, ownerOnly: true },
    { to: `/${selectedBrand.slug}/AnalyticsGraph`, label: 'Analytics Graph', icon: BarChart3, ownerOnly: false },
    { to: `/${selectedBrand.slug}/AIBrandReview`, label: 'AI Brand Review', icon: ClipboardCheck, ownerOnly: false },
    { to: `/${selectedBrand.slug}/Team`, label: 'Team & RBAC', icon: Users, ownerOnly: false },
    { to: `/${selectedBrand.slug}/BrandGuidelines`, label: 'Brand Guidelines', icon: BookOpen, ownerOnly: false },
    { to: `/${selectedBrand.slug}/ApprovalQueue`, label: 'Approval Queue', icon: CheckSquare, ownerOnly: false },
    { to: `/${selectedBrand.slug}/Settings`, label: 'Settings', icon: Settings, ownerOnly: false },
  ];

  const employeeNavItems = isOwner ? [] : [
    { to: `/${selectedBrand.slug}/Upload`, label: 'Upload & Audit', icon: UploadCloud, ownerOnly: false },
    { to: `/${selectedBrand.slug}/MyPerformance`, label: 'My Performance', icon: Sparkles, ownerOnly: false },
  ];

  const allNavs = selectedBrand.id ? [
    baseNavItems[0], // Home
    ...employeeNavItems,
    ...baseNavItems.slice(1).filter(item => isOwner || !item.ownerOnly)
  ] : [baseNavItems[0]];

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const promptText = chatInput.toLowerCase();
    let replyText = `I analyzed your query against the ${selectedBrand.name} knowledge base. All collateral must adhere to verified product specs and terminology guidelines.`;

    if (promptText.includes('battery') || promptText.includes('claim')) {
      replyText = `Verified specification for ${selectedBrand.name}: Maximum battery limit is ${guidelines.productSpecs[0]?.maxBatteryLifeHours || 24} hours. Absolute claims like 'infinite' or '100 hours' are strictly flagged as violations.`;
    } else if (promptText.includes('water') || promptText.includes('waterproof')) {
      replyText = `Terminology rule check: 'Waterproof' is prohibited. Please use '${guidelines.terminologyRules.find(r => r.term.toLowerCase().includes('water'))?.correction || 'Water-resistant'}' instead.`;
    }

    const aiMsg: ChatMessage = {
      id: 'm-' + (Date.now() + 1),
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg, aiMsg]);
    setChatInput('');
  };

  return (
    <>
      <header className="sticky top-0 z-45 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand selector */}
            <div className="flex items-center space-x-6">
              <div
                onClick={() => navigate(`/${selectedBrand.slug}/Home`)}
                className="flex items-center space-x-3 cursor-pointer select-none group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow group-hover:bg-blue-600 transition">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">Droplet AI</span>
                  <span className="text-[10px] uppercase tracking-widest text-blue-600 font-semibold">Brand Governance</span>
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
                      navigate(`/${b.slug}/Home`);
                    }
                  }}
                  className="bg-gray-50 border border-gray-300 text-xs text-slate-800 rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-600 cursor-pointer font-medium"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>🏢 {b.name} ({b.complianceRate}%)</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* AI Assistant Quick Trigger & Read-Only User Info Chip */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowAiChatDrawer(true)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm select-none"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">AI Assistant</span>
              </button>

              <div className="hidden lg:flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-blue-600" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-900 text-xs">{currentUser.name}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono font-medium">{currentUser.role}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  navigate('/login');
                }}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex space-x-1 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
            {allNavs.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3.5 pb-2 text-xs font-semibold whitespace-nowrap transition select-none ${
                      isActive
                        ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
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

      {/* AI Assistant Chat Drawer */}
      {showAiChatDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between animate-fade-in">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-bold">Gemini AI Assistant</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAiChatDrawer(false)}
              className="text-slate-300 hover:text-white text-lg font-bold px-2"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 slim-scrollbar">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-gray-200 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`block text-[9px] ${msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-t border-gray-200 flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about brand rules, battery limits, tone..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition shadow flex items-center justify-center select-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
