import React, { createContext, useContext, useState, useEffect } from 'react';
import type { BrandGuidelines, TeamMember, ContentItem, EnterpriseBrand } from '../types';
import { INITIAL_BRANDS, INITIAL_GUIDELINES, INITIAL_TEAM, INITIAL_CONTENTS } from '../mockData';

interface AppContextType {
  brands: EnterpriseBrand[];
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
  selectedBrand: EnterpriseBrand;
  guidelines: BrandGuidelines;
  updateGuidelines: (updater: (prev: BrandGuidelines) => BrandGuidelines) => void;
  team: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMemberStatus: (id: string, status: TeamMember['status']) => void;
  contents: ContentItem[];
  addContent: (content: ContentItem) => void;
  updateContentStatus: (id: string, status: ContentItem['status'], note?: string) => void;
  updateContentIssueStatus: (contentId: string, issueId: string, status: 'accepted' | 'rejected' | 'modified', newFix?: string) => void;
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands] = useState<EnterpriseBrand[]>(() => {
    const saved = localStorage.getItem('droplet_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRANDS;
  });

  const [selectedBrandId, setSelectedBrandId] = useState<string>(() => {
    const saved = localStorage.getItem('droplet_selected_brand');
    return saved || 'b-1';
  });

  const [guidelines, setGuidelines] = useState<BrandGuidelines>(() => {
    const saved = localStorage.getItem('droplet_guidelines');
    return saved ? JSON.parse(saved) : INITIAL_GUIDELINES;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('droplet_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [contents, setContents] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('droplet_contents');
    return saved ? JSON.parse(saved) : INITIAL_CONTENTS;
  });

  const [currentUser, setCurrentUser] = useState<TeamMember>(() => {
    const saved = localStorage.getItem('droplet_current_user');
    return saved ? JSON.parse(saved) : INITIAL_TEAM[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('droplet_auth');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('droplet_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('droplet_selected_brand', selectedBrandId);
  }, [selectedBrandId]);

  useEffect(() => {
    localStorage.setItem('droplet_guidelines', JSON.stringify(guidelines));
  }, [guidelines]);

  useEffect(() => {
    localStorage.setItem('droplet_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('droplet_contents', JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem('droplet_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('droplet_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const selectedBrand = brands.find(b => b.id === selectedBrandId) || brands[0];

  const updateGuidelines = (updater: (prev: BrandGuidelines) => BrandGuidelines) => {
    setGuidelines(updater);
  };

  const addTeamMember = (member: TeamMember) => {
    setTeam(prev => [member, ...prev]);
  };

  const updateTeamMemberStatus = (id: string, status: TeamMember['status']) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, status } : m));
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

  const updateContentStatus = (id: string, status: ContentItem['status'], note?: string) => {
    let affectedContent: ContentItem | undefined;
    setContents(prev => prev.map(item => {
      if (item.id !== id) return item;
      affectedContent = item;
      const newHistoryItem = {
        id: 'rev-' + Date.now(),
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        author: currentUser.name,
        action: `Status changed to ${status}`,
        note: note || `Review sign-off by ${currentUser.name} (${currentUser.role})`
      };
      return {
        ...item,
        status,
        revisionHistory: [newHistoryItem, ...item.revisionHistory]
      };
    }));

    // Update individual author's performance score based on Approved vs Rejected/Changes
    if (affectedContent) {
      const authorName = (affectedContent as ContentItem).author;
      setTeam(prev => prev.map(m => {
        if (m.name === authorName) {
          let delta = 0;
          if (status === 'Approved') delta = +4;
          if (status === 'Rejected') delta = -8;
          if (status === 'Changes Requested') delta = -3;
          const updatedScore = Math.min(100, Math.max(40, (m.personalComplianceScore || 85) + delta));
          const updatedHistory = [
            ...(m.historyScores || []),
            { date: 'Review', score: updatedScore, label: `${status} sign-off` }
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
    setContents(prev => prev.map(item => {
      if (item.id !== contentId) return item;
      const updatedIssues = item.issues.map((iss: any) => {
        if (iss.id !== issueId) return iss;
        return {
          ...iss,
          status,
          suggestedFix: newFix !== undefined ? newFix : iss.suggestedFix
        };
      });
      // Recalculate compliance score
      const acceptedCount = updatedIssues.filter((i: any) => i.status === 'accepted' || i.status === 'modified').length;
      const totalCount = updatedIssues.length;
      const newScore = Math.min(100, Math.round(item.complianceScore + (acceptedCount / totalCount) * 15));

      return {
        ...item,
        issues: updatedIssues,
        complianceScore: newScore
      };
    }));
  };

  return (
    <AppContext.Provider value={{
      brands,
      selectedBrandId,
      setSelectedBrandId,
      selectedBrand,
      guidelines,
      updateGuidelines,
      team,
      addTeamMember,
      updateTeamMemberStatus,
      contents,
      addContent,
      updateContentStatus,
      updateContentIssueStatus,
      currentUser,
      setCurrentUser,
      isAuthenticated,
      setIsAuthenticated
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
