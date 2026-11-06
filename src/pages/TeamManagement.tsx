import React from 'react';
import { Users, Shield, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeamMember } from '../types';

export const TeamManagement: React.FC = () => {
  const { team, updateTeamMemberStatus, currentUser } = useApp();

  const isOwner = currentUser.role === 'Brand Owner / Admin';

  const roleDescriptions: Record<TeamMember['role'], string> = {
    'Brand Owner / Admin': 'Full administrative control, master guideline editing, team permissions, and global analytics.',
    'Marketing Manager': 'Departmental campaign orchestration, audit queue triage, and content sign-off.',
    'Content Creator': 'Drafting press releases, ads, whitepapers, and submitting collateral for automated AI audits.',
    'Graphic Designer': 'Visual asset uploading, OpenCV logo clearance verification, and banner compliance.',
    'Authorised Reviewer': 'Legal & executive sign-off, final approval or rejection of flagged high-risk content.'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Management & Role-Based Access Control</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOwner ? 'Manage enterprise employee access and permissions.' : 'Team directory & RBAC inspector (Read-Only).'}
              </p>
            </div>
          </div>
        </div>

        {!isOwner && (
          <div className="mt-4 md:mt-0">
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
              🔒 Non-Owner View: Owner status controls locked
            </span>
          </div>
        )}
      </div>

      {/* Role Hierarchy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {(Object.keys(roleDescriptions) as TeamMember['role'][]).map((r, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900">{r}</h3>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{roleDescriptions[r]}</p>
          </div>
        ))}
      </div>

      {/* Team Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3.5">Team Member</th>
              <th className="px-6 py-3.5">Governance Role</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-slate-800">
            {team.map((member) => {
              const isTargetAdmin = member.role === 'Brand Owner / Admin';
              // CRITICAL SECURITY RULE: Non-Owners can NEVER suspend or modify Brand Owners / Admins.
              const canModify = isOwner && !isTargetAdmin;

              return (
                <tr key={member.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover border border-gray-300 shadow-sm" />
                    <div>
                      <span className="font-bold text-slate-900 block">{member.name}</span>
                      <span className="text-[11px] text-slate-500">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{member.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      member.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      member.status === 'invited' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canModify ? (
                      <select
                        value={member.status}
                        onChange={(e) => updateTeamMemberStatus(member.id, e.target.value as any)}
                        className="bg-gray-50 border border-gray-300 text-xs text-slate-800 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="active">Active</option>
                        <option value="invited">Invited</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                        {isTargetAdmin ? '🔒 Protected Admin' : '🔒 Read-Only'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
