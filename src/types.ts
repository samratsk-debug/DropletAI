export interface BrandGuidelines {
  productSpecs: {
    id: string;
    productName: string;
    subtitle?: string;
    verifiedMetric: string;
    allowedClaims: string[];
    forbiddenClaims: string[];
    maxBatteryLifeHours: number;
    waterResistanceRating: string;
  }[];
  terminologyRules: {
    id: string;
    term: string;
    correction: string;
    reason: string;
    category: 'mandatory' | 'forbidden' | 'preferred';
    context?: string;
  }[];
  toneOfVoice: {
    formality: number; // 0 (casual) to 100 (formal)
    enthusiasm: number; // 0 (subdued) to 100 (high energy)
    technicalDepth: number; // 0 (layman) to 100 (expert engineering)
    guidelinesText: string;
  };
  visualAssets: {
    id: string;
    name: string;
    type: 'logo' | 'banner' | 'icon' | 'typography';
    url: string;
    minClearancePx: number;
  }[];
  colorPalette: {
    id: string;
    name: string;
    hex: string;
    type: 'solid' | 'gradient';
    gradientStop?: string;
    gradientAngle?: number;
    gradientType?: 'linear' | 'radial';
    role: 'primary' | 'secondary' | 'accent' | 'background' | 'warning';
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Brand Owner / Admin' | 'Marketing Manager' | 'Content Creator' | 'Graphic Designer' | 'Authorised Reviewer';
  department: string;
  status: 'active' | 'invited' | 'suspended';
  avatar: string;
  personalComplianceScore?: number;
  historyScores?: { date: string; score: number; label: string }[];
}

export interface AuditIssue {
  id: string;
  category: 'Factual Inconsistencies' | 'Unsupported Claims' | 'Tone Mismatches' | 'Visual Errors';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  sourcePassage?: string;
  suggestedFix: string;
  location?: { line?: number; element?: string };
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'text' | 'document' | 'ad' | 'banner' | 'social';
  brandId: string;
  brandName: string;
  author: string;
  authorEmail?: string;
  department: string;
  createdAt: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Changes Requested';
  complianceScore: number;
  contentBody: string;
  imageUrl?: string;
  issues: AuditIssue[];
  revisionHistory: {
    id: string;
    timestamp: string;
    author: string;
    action: string;
    note: string;
  }[];
}

export interface EnterpriseBrand {
  id: string;
  slug: string;
  name: string;
  complianceRate: number;
  activeAuditsCount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  lastSync: string;
  departmentCount: number;
}
