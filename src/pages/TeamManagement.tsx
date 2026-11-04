import React, { useState } from 'react';
import { Users, UserPlus, Shield, CheckCircle, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeamMember } from '../types';

export const TeamManagement: React.FC = () => {
  const { team, addTeamMember, updateTeamMemberStatus } = useApp();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Content Creator');
  const [department, setDepartment] = useState('Copywriting');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const newMember: TeamMember = {
      id: 'tm-' + Date.now(),
      name,
      email,
      role,
      department,
      status: 'invited',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*900000000)}?w=150&auto=format&fit=crop&q=80`
    };
    addTeamMember(newMember);
    setShowInviteModal(false);
    setName('');
    setEmail('');
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Team Management & Role-Based Access Control</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage enterprise employee access across 5 distinct governance roles.</p>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center space-x-2 shadow-lg shadow-indigo-600/20 select-none"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Role Hierarchy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {(Object.keys(roleDescriptions) as TeamMember['role'][]).map((r, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white">{r}</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{roleDescriptions[r]}</p>
          </div>
        ))}
      </div>

      {/* Team Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3.5">Team Member</th>
              <th className="px-6 py-3.5">Governance Role</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-slate-850/50 transition">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                  <div>
                    <span className="font-semibold text-white block">{member.name}</span>
                    <span className="text-[11px] text-slate-400">{member.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{member.department}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    member.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                    member.status === 'invited' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                    'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={member.status}
                    onChange={(e) => updateTeamMemberStatus(member.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="invited">Invited</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Invite Team Member</h2>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Connor"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.c@droplet.ai"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Governance Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="Brand Owner / Admin">Brand Owner / Admin</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Content Creator">Content Creator</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Authorised Reviewer">Authorised Reviewer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-indigo-600/20 select-none"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
