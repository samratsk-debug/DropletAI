import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, ShieldAlert, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EnterpriseAnalytics: React.FC = () => {
  const { brands, contents, setSelectedBrandId } = useApp();
  const navigate = useNavigate();
  const recentFindings = contents.filter(item => item.issues.length > 0).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-3 pb-6 border-b border-gray-200">
        <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow"><Globe2 className="w-6 h-6" /></div>
        <div><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workspace overview</h1><p className="text-xs text-slate-500 mt-0.5">Submissions and review status across your brands.</p></div>
      </div>

      {brands.length === 0 ? <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-slate-500">No brands yet. Create a brand to start using the audit workspace.</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {brands.map(brand => {
            const submissions = contents.filter(item => item.brandId === brand.id);
            const scored = submissions.filter(item => item.complianceScore > 0);
            const average = scored.length ? Math.round(scored.reduce((sum, item) => sum + item.complianceScore, 0) / scored.length) : null;
            const findings = submissions.reduce((sum, item) => sum + item.issues.length, 0);
            const pending = submissions.filter(item => item.status === 'Pending Review').length;
            return <button key={brand.id} type="button" onClick={() => { setSelectedBrandId(brand.id); navigate(`/${brand.slug}/AnalyticsGraph`); }} className="text-left bg-white border border-gray-200 hover:border-indigo-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition group space-y-4">
              <div className="flex justify-between items-start"><h2 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{brand.name}</h2><ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" /></div>
              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
                <div><div className="text-xl font-bold text-slate-900 font-mono">{submissions.length}</div><div className="text-[10px] text-slate-500">Submissions</div></div>
                <div><div className="text-xl font-bold text-slate-900 font-mono">{average === null ? '—' : `${average}%`}</div><div className="text-[10px] text-slate-500">Avg. score</div></div>
                <div><div className="text-xl font-bold text-slate-900 font-mono">{findings}</div><div className="text-[10px] text-slate-500">Findings</div></div>
              </div>
              <div className="text-[11px] text-slate-500">{pending} pending review</div>
            </button>;
          })}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2"><ShieldAlert className="w-4 h-4 text-amber-600" /><h2 className="text-sm font-bold text-slate-900">Recent submissions with findings</h2></div>
        {recentFindings.length ? <div className="divide-y divide-gray-100">{recentFindings.map(item => <button key={item.id} type="button" onClick={() => { const brand = brands.find(b => b.id === item.brandId); if (brand) { setSelectedBrandId(brand.id); navigate(`/${brand.slug}/ContentAuditReport/${item.id}`); } }} className="w-full py-3 flex items-center justify-between text-left hover:bg-gray-50"><span><span className="block text-xs font-semibold text-slate-800">{item.title}</span><span className="text-[10px] text-slate-500">{item.brandName} · {item.issues.length} finding{item.issues.length === 1 ? '' : 's'}</span></span><span className="text-[10px] text-slate-500">{item.status}</span></button>)}</div> : <p className="text-xs text-slate-500">No findings in the loaded submissions.</p>}
      </div>
    </div>
  );
};
