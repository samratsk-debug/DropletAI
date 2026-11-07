import React, { useState } from 'react';
import { Users, Shield, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeamMember } from '../types';

export const TeamManagement: React.FC = () => {
  const { team, addTeamMember, updateTeamMemberRole, currentUser } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Content Creator');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwner = currentUser.role === 'Brand Owner / Admin';
  const canManageMembers = isOwner;

  const handleAddMember = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await addTeamMember({
        id: '', name: email, email, role, department: 'General', status: 'active', avatar: ''
      });
      setEmail('');
      setShowAdd(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not add this member.');
    } finally {
      setSaving(false);
    }
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

        {canManageMembers && (
          <button type="button" onClick={() => setShowAdd(true)} className="mt-4 md:mt-0 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add registered user
          </button>
        )}
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
              // Owner and admin membership cannot be changed through the member role endpoint.
              const canModify = canManageMembers && !isTargetAdmin;

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
                        value={member.role === 'Brand Owner / Admin' ? 'ADMIN' : member.role}
                        onChange={(e) => void updateTeamMemberRole(member.id, e.target.value as TeamMember['role']).catch(() => undefined)}
                        className="bg-gray-50 border border-gray-300 text-xs text-slate-800 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="Marketing Manager">Marketing Manager</option>
                        <option value="Content Creator">Content Creator</option>
                        <option value="Authorised Reviewer">Authorised Reviewer</option>
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
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleAddMember} className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Add an existing account</h2>
            <p className="text-xs text-slate-600">The backend only adds users who have already registered. New account invitations are not available yet.</p>
            {formError && <p role="alert" className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{formError}</p>}
            <label className="block text-xs font-medium text-slate-700">Account email
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </label>
            <label className="block text-xs font-medium text-slate-700">Role
              <select value={role} onChange={e => setRole(e.target.value as TeamMember['role'])} className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="Content Creator">Content Creator</option>
                <option value="Marketing Manager">Marketing Manager</option>
                <option value="Authorised Reviewer">Authorised Reviewer</option>
                <option value="Brand Owner / Admin" disabled>Admin (not assignable here)</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border text-xs">Cancel</button>
              <button disabled={saving} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs disabled:opacity-60">{saving ? 'Adding…' : 'Add member'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
