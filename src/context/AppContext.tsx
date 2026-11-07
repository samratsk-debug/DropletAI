import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { BrandGuidelines, TeamMember, ContentItem, EnterpriseBrand } from '../types';
import { INITIAL_BRANDS, INITIAL_GUIDELINES, INITIAL_TEAM, INITIAL_CONTENTS } from '../mockData';
import { ApiError, api, clearAuthSession, currentOrganisationId, getAuthSession, type ApiSubmission } from '../api';

interface AppContextType {
  brands: EnterpriseBrand[];
  addBrand: (brand: EnterpriseBrand) => Promise<EnterpriseBrand>;
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
  selectedBrand: EnterpriseBrand;
  guidelines: BrandGuidelines;
  updateGuidelines: (updater: (prev: BrandGuidelines) => BrandGuidelines) => void;
  team: TeamMember[];
  addTeamMember: (member: TeamMember) => Promise<void>;
  updateTeamMemberStatus: (id: string, status: TeamMember['status']) => void;
  updateTeamMemberRole: (id: string, role: TeamMember['role']) => Promise<void>;
  contents: ContentItem[];
  addContent: (content: ContentItem) => void;
  updateContentStatus: (id: string, status: ContentItem['status'], note?: string) => Promise<void>;
  updateContentIssueStatus: (contentId: string, issueId: string, status: 'accepted' | 'rejected' | 'modified', newFix?: string) => void;
  updateCurrentUser: (updates: Partial<TeamMember>) => void;
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  organisationId: string;
  isLoadingWorkspace: boolean;
  apiError: string;
  clearApiError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<EnterpriseBrand[]>(() => getAuthSession() ? [] : INITIAL_BRANDS);

  const [selectedBrandId, setSelectedBrandIdState] = useState<string>(() => {
    return sessionStorage.getItem('droplet_selected_brand') || '';
  });

  const [guidelines, setGuidelines] = useState<BrandGuidelines>(() => {
    return INITIAL_GUIDELINES;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    return getAuthSession() ? [] : INITIAL_TEAM;
  });

  const [contents, setContents] = useState<ContentItem[]>(() => {
    return getAuthSession() ? [] : INITIAL_CONTENTS;
  });

  const [currentUser, setCurrentUser] = useState<TeamMember>(() => {
    return getAuthSession() ? {
      id: getAuthSession()!.userId,
      name: getAuthSession()!.fullName,
      email: getAuthSession()!.email,
      role: getAuthSession()!.role === 'OWNER' ? 'Brand Owner / Admin' : 'Content Creator',
      department: 'General',
      status: 'active',
      avatar: ''
    } : { id: '', name: 'Guest', email: '', role: 'Content Creator', department: 'General', status: 'active', avatar: '' };
  });

  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => Boolean(getAuthSession()));
  const [organisationId, setOrganisationId] = useState(currentOrganisationId());
  const [, setIsLoadingWorkspace] = useState(false);
  const [hasLoadedWorkspace, setHasLoadedWorkspace] = useState(false);
  const [apiError, setApiError] = useState('');
  const guidelineRecordIds = useRef<Record<string, string>>({});

  const setIsAuthenticated = (authenticated: boolean) => {
    if (!authenticated) {
      clearAuthSession();
      setOrganisationId('');
      setBrands(INITIAL_BRANDS);
      setTeam(INITIAL_TEAM);
      setContents(INITIAL_CONTENTS);
      setGuidelines(INITIAL_GUIDELINES);
      setSelectedBrandIdState(INITIAL_BRANDS[0]?.id || '');
      sessionStorage.removeItem('droplet_selected_brand');
      setHasLoadedWorkspace(false);
    } else {
      setOrganisationId(currentOrganisationId());
      setBrands([]);
      setTeam([]);
      setContents([]);
      setGuidelines(INITIAL_GUIDELINES);
      setSelectedBrandIdState('');
      sessionStorage.removeItem('droplet_selected_brand');
      setHasLoadedWorkspace(false);
    }
    setIsAuthenticatedState(authenticated);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const session = getAuthSession();
    if (!session) {
      setIsAuthenticated(false);
      return;
    }
    setCurrentUser({
      id: session.userId,
      name: session.fullName,
      email: session.email,
      role: session.role === 'OWNER' || session.role === 'ADMIN'
        ? 'Brand Owner / Admin'
        : session.role === 'MARKETING_MANAGER' ? 'Marketing Manager'
          : session.role === 'REVIEWER' ? 'Authorised Reviewer' : 'Content Creator',
      department: 'General',
      status: 'active',
      avatar: ''
    });
  }, [isAuthenticated]);

  useEffect(() => {
    const onUnauthorized = () => setIsAuthenticated(false);
    window.addEventListener('droplet:unauthorized', onUnauthorized);
    return () => window.removeEventListener('droplet:unauthorized', onUnauthorized);
  }, []);

  useEffect(() => {
    const session = getAuthSession();
    if (!isAuthenticated || !session?.organisationId) {
      setHasLoadedWorkspace(false);
      return;
    }
    let active = true;
    setIsLoadingWorkspace(true);
    setApiError('');
    Promise.all([
      api.getBrands(session.organisationId),
      api.getGuidelines(session.organisationId),
      api.getMembers(session.organisationId),
      api.getSubmissions(session.organisationId)
    ]).then(([apiBrands, apiGuidelines, apiMembers, apiContents]) => {
      if (!active) return;
      const mappedBrands: EnterpriseBrand[] = apiBrands.map(brand => ({
        id: brand.id,
        slug: brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: brand.name,
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=0f172a&color=fff`,
        complianceRate: 0,
        activeAuditsCount: 0,
        riskLevel: 'Low',
        lastSync: brand.createdAt,
        departmentCount: 0,
        description: brand.description
      }));
      setBrands(mappedBrands);
      const savedBrandId = sessionStorage.getItem('droplet_selected_brand');
      const firstBrand = mappedBrands.find(b => b.id === savedBrandId) || mappedBrands[0];
      if (firstBrand) {
        setSelectedBrandIdState(firstBrand.id);
        sessionStorage.setItem('droplet_selected_brand', firstBrand.id);
        const record = apiGuidelines.find(g => g.brandId === firstBrand.id && g.title === '__droplet_guidelines_v1__');
        if (record) guidelineRecordIds.current[firstBrand.id] = record.id;
        if (record) {
          try { setGuidelines(JSON.parse(record.content) as BrandGuidelines); }
          catch { setGuidelines(INITIAL_GUIDELINES); }
        } else setGuidelines(INITIAL_GUIDELINES);
      } else {
        setSelectedBrandIdState('');
        sessionStorage.removeItem('droplet_selected_brand');
        setGuidelines(INITIAL_GUIDELINES);
      }
      const roleLabel = (role: string): TeamMember['role'] => role === 'OWNER' || role === 'ADMIN'
        ? 'Brand Owner / Admin'
        : role === 'MARKETING_MANAGER' ? 'Marketing Manager'
          : role === 'REVIEWER' ? 'Authorised Reviewer' : 'Content Creator';
      setTeam(apiMembers.map(member => ({
        id: member.membershipId,
        name: member.fullName,
        email: member.email,
        role: roleLabel(member.role),
        department: 'General',
        status: 'active',
        avatar: ''
      })));
      setContents(apiContents.map(mapSubmission));
      setHasLoadedWorkspace(true);
    }).catch(error => {
      if (active) {
        setHasLoadedWorkspace(true);
        setApiError(error instanceof ApiError ? error.message : 'Could not load your workspace.');
      }
    }).finally(() => {
      if (active) setIsLoadingWorkspace(false);
    });
    return () => { active = false; };
  }, [isAuthenticated, organisationId]);

  const setSelectedBrandId = (id: string) => {
    sessionStorage.setItem('droplet_selected_brand', id);
    setSelectedBrandIdState(id);
  };

  useEffect(() => {
    if (!isAuthenticated || !hasLoadedWorkspace || !selectedBrandId || !organisationId) return;
    if (!guidelineRecordIds.current[selectedBrandId]) {
      api.getGuidelines(organisationId).then(records => {
        const record = records.find(g => g.brandId === selectedBrandId && g.title === '__droplet_guidelines_v1__');
        if (record) {
          guidelineRecordIds.current[selectedBrandId] = record.id;
          try { setGuidelines(JSON.parse(record.content) as BrandGuidelines); }
          catch { setApiError('Saved brand guidelines could not be read.'); }
        } else {
          delete guidelineRecordIds.current[selectedBrandId];
          setGuidelines(INITIAL_GUIDELINES);
        }
      }).catch(error => setApiError(error instanceof ApiError ? error.message : 'Could not load brand guidelines.'));
    }
  }, [isAuthenticated, hasLoadedWorkspace, selectedBrandId, organisationId]);

  const selectedBrand = brands.find(b => b.id === selectedBrandId) || brands[0] || {
    id: '', slug: 'workspace', name: 'Workspace', logo: '', complianceRate: 0,
    activeAuditsCount: 0, riskLevel: 'Low' as const, lastSync: '', departmentCount: 0
  };

  function mapSubmission(submission: ApiSubmission): ContentItem {
    const report = submission.analysisReport;
    const issueLines = report?.issuesJson && !report.issuesJson.startsWith('No major')
      ? report.issuesJson.split(/\r?\n/).map(line => line.replace(/^\s*-\s*/, '').trim()).filter(Boolean)
      : [];
    const severity = report?.riskCategory === 'CRITICAL' || report?.riskCategory === 'HIGH' ? 'high' : report?.riskCategory === 'MEDIUM' ? 'medium' : 'low';
    const statusMap: Record<string, ContentItem['status']> = {
      APPROVED: 'Approved', REJECTED: 'Rejected', REVISION_REQUESTED: 'Changes Requested', PENDING_REVIEW: 'Pending Review', SUBMITTED: 'Pending Review', ANALYZING: 'Pending Review', DRAFT: 'Pending Review'
    };
    return {
      id: submission.id,
      title: submission.title,
      type: (submission.contentType.toLowerCase().includes('social') ? 'social' : submission.contentType.toLowerCase().includes('ad') ? 'ad' : submission.contentType.toLowerCase().includes('banner') ? 'banner' : 'document'),
      brandId: submission.brandId,
      brandName: submission.brandName,
      author: submission.submittedByEmail,
      authorEmail: submission.submittedByEmail,
      department: 'General',
      createdAt: submission.createdAt,
      status: statusMap[submission.status] || 'Pending Review',
      complianceScore: Math.max(0, 100 - (report?.riskScore ?? 0)),
      contentBody: submission.content,
      issues: issueLines.map((line, index) => ({
        id: `${submission.id}-issue-${index}`,
        category: 'Unsupported Claims' as const,
        severity,
        title: `Finding ${index + 1}`,
        description: line,
        suggestedFix: report?.aiRecommendations || 'Review this content against the approved brand guidance.',
        status: 'pending' as const
      })),
      revisionHistory: [{
        id: `${submission.id}-created`, timestamp: submission.createdAt,
        author: submission.submittedByEmail, action: 'Submitted for review', note: report?.summary || ''
      }]
    };
  }

  const addBrand = async (brand: EnterpriseBrand): Promise<EnterpriseBrand> => {
    const created = await api.createBrand(organisationId, { name: brand.name, description: brand.description });
    const mapped: EnterpriseBrand = {
      ...brand,
      id: created.id,
      slug: created.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: created.name,
      description: created.description,
      lastSync: created.createdAt
    };
    setBrands(prev => [mapped, ...prev]);
    return mapped;
  };

  const updateGuidelines = (updater: (prev: BrandGuidelines) => BrandGuidelines) => {
    if (isAuthenticated && currentUser.role !== 'Brand Owner / Admin') {
      setApiError('Only organisation owners and admins can edit brand guidelines.');
      return;
    }
    const updated = updater(guidelines);
    setGuidelines(updated);
    if (!isAuthenticated || !organisationId) return;
    const recordId = guidelineRecordIds.current[selectedBrandId];
    const body = {
      title: '__droplet_guidelines_v1__',
      content: JSON.stringify(updated),
      brandId: selectedBrandId || undefined
    };
    const save = recordId
      ? api.updateGuideline(organisationId, recordId, body)
      : api.createGuideline(organisationId, body);
    save.then(record => { guidelineRecordIds.current[selectedBrandId] = record.id; })
      .catch(error => setApiError(error instanceof ApiError ? error.message : 'Could not save brand guidelines.'));
  };

  const addTeamMember = async (member: TeamMember) => {
    const roles: Record<TeamMember['role'], string> = {
      'Brand Owner / Admin': 'ADMIN', 'Marketing Manager': 'MARKETING_MANAGER',
      'Content Creator': 'CONTENT_CREATOR', 'Graphic Designer': 'CONTENT_CREATOR',
      'Authorised Reviewer': 'REVIEWER'
    };
    await api.addMember(organisationId, member.email, roles[member.role]);
    const members = await api.getMembers(organisationId);
    const created = members.find(item => item.email.toLowerCase() === member.email.toLowerCase());
    if (created) setTeam(prev => [{ ...member, id: created.membershipId, name: created.fullName, role: ({ OWNER: 'Brand Owner / Admin', ADMIN: 'Brand Owner / Admin', MARKETING_MANAGER: 'Marketing Manager', REVIEWER: 'Authorised Reviewer', CONTENT_CREATOR: 'Content Creator' } as const)[created.role as 'OWNER' | 'ADMIN' | 'MARKETING_MANAGER' | 'REVIEWER' | 'CONTENT_CREATOR'] }, ...prev]);
  };

  const updateTeamMemberStatus = (id: string, status: TeamMember['status']) => {
    void id;
    void status;
    setApiError('Member activation and suspension are not supported by the backend yet. No change was saved.');
  };

  const updateTeamMemberRole = async (id: string, role: TeamMember['role']) => {
    const roles: Record<TeamMember['role'], string> = {
      'Brand Owner / Admin': 'ADMIN', 'Marketing Manager': 'MARKETING_MANAGER',
      'Content Creator': 'CONTENT_CREATOR', 'Graphic Designer': 'CONTENT_CREATOR',
      'Authorised Reviewer': 'REVIEWER'
    };
    try {
      await api.updateMemberRole(organisationId, id, roles[role]);
      setTeam(prev => prev.map(member => member.id === id ? { ...member, role } : member));
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Could not update the team role.';
      setApiError(message);
      throw new Error(message);
    }
  };

  const addContent = (content: ContentItem) => {
    setContents(prev => [content, ...prev]);
    // Also update author's personal score if content creator
    setTeam(prev => prev.map(m => {
      if (m.name === content.author || m.email === content.authorEmail) {
        const newScore = Math.round(((m.personalComplianceScore || 85) + content.complianceScore) / 2);
        const newHistory = [
          ...(m.historyScores || []),
          { date: 'Just now', score: content.complianceScore, label: content.title.slice(0, 15) }
        ];
        return {
          ...m,
          personalComplianceScore: newScore,
          historyScores: newHistory
        };
      }
      return m;
    }));
  };

  const updateContentStatus = async (id: string, status: ContentItem['status'], note?: string) => {
    const action = status === 'Approved' ? 'APPROVE' : status === 'Rejected' ? 'REJECT' : 'REQUEST_REVISION';
    let updated: ApiSubmission;
    try {
      updated = await api.reviewSubmission(organisationId, id, action, note);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Could not update the review status.';
      setApiError(message);
      throw new Error(message);
    }
    const affectedContent = contents.find(item => item.id === id);
    setContents(prev => prev.map(item => {
      if (item.id !== id) return item;
      const mapped = mapSubmission(updated);
      const newHistoryItem = {
        id: 'rev-' + Date.now(),
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        author: currentUser.name,
        action: `Status changed to ${mapped.status}`,
        note: note || `Review sign-off by ${currentUser.name} (${currentUser.role})`
      };
      return { ...mapped, revisionHistory: [newHistoryItem, ...item.revisionHistory] };
    }));

    // Update individual author's performance score based on Approved vs Rejected/Changes
    if (affectedContent) {
      const authorName = affectedContent.author;
      setTeam(prev => prev.map(m => {
        if (m.name === authorName) {
          let delta = 0;
          if (status === 'Approved') delta = +4;
          if (status === 'Rejected') delta = -12;
          if (status === 'Changes Requested') delta = -6;
          const updatedScore = Math.min(100, Math.max(30, (m.personalComplianceScore || 85) + delta));
          const updatedHistory = [
            ...(m.historyScores || []),
            { date: 'Review', score: updatedScore, label: `${status}` }
          ];
          return {
            ...m,
            personalComplianceScore: updatedScore,
            historyScores: updatedHistory
          };
        }
        return m;
      }));
    }
  };

  const updateContentIssueStatus = (contentId: string, issueId: string, status: 'accepted' | 'rejected' | 'modified', newFix?: string) => {
    void contentId;
    void issueId;
    void status;
    void newFix;
    setApiError('Per-finding fix decisions are not supported by the backend API yet. No change was saved.');
  };

  const updateCurrentUser = (updates: Partial<TeamMember>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  return (
    <AppContext.Provider value={{
      brands,
      addBrand,
      selectedBrandId,
      setSelectedBrandId,
      selectedBrand,
      guidelines,
      updateGuidelines,
      team,
      addTeamMember,
      updateTeamMemberStatus,
      updateTeamMemberRole,
      contents,
      addContent,
      updateContentStatus,
      updateContentIssueStatus,
      updateCurrentUser,
      currentUser,
      setCurrentUser,
      isAuthenticated,
      setIsAuthenticated,
      organisationId,
      isLoadingWorkspace: isAuthenticated && !hasLoadedWorkspace,
      apiError,
      clearApiError: () => setApiError('')
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
