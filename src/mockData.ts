import { BrandGuidelines, TeamMember, ContentItem, EnterpriseBrand } from './types';

export const INITIAL_BRANDS: EnterpriseBrand[] = [
  { id: 'b-1', slug: 'droplet-core-hardware', name: 'Droplet Core Hardware', complianceRate: 94.5, activeAuditsCount: 12, riskLevel: 'Low', lastSync: '2026-11-04 14:30', departmentCount: 5 },
  { id: 'b-2', slug: 'droplet-enterprise-cloud', name: 'Droplet Enterprise Cloud', complianceRate: 88.2, activeAuditsCount: 8, riskLevel: 'Medium', lastSync: '2026-11-04 12:15', departmentCount: 3 },
  { id: 'b-3', slug: 'droplet-mobile-os', name: 'Droplet Mobile OS', complianceRate: 91.8, activeAuditsCount: 15, riskLevel: 'Low', lastSync: '2026-11-04 11:00', departmentCount: 4 },
  { id: 'b-4', slug: 'droplet-audio-labs', name: 'Droplet Audio Labs', complianceRate: 79.4, activeAuditsCount: 6, riskLevel: 'High', lastSync: '2026-11-03 18:45', departmentCount: 2 },
];

export const INITIAL_GUIDELINES: BrandGuidelines = {
  productSpecs: [
    {
      id: 'spec-1',
      productName: 'Droplet Pod Pro X',
      subtitle: 'Premium Active Noise-Canceling Acoustic Earphones',
      verifiedMetric: '24-hour continuous playback with ANC enabled',
      allowedClaims: ['Up to 24h battery', 'Active Noise Cancellation', 'Spatial Audio support'],
      forbiddenClaims: ['Infinite battery', '100 hours playback', 'Waterproof for diving'],
      maxBatteryLifeHours: 24,
      waterResistanceRating: 'IPX7 (Splash & sweat resistant)',
    },
    {
      id: 'spec-2',
      productName: 'Droplet Ultra Watch',
      subtitle: 'Multi-Sport Titanium Enterprise Smartwatch',
      verifiedMetric: '7-day standard smartwatch usage mode',
      allowedClaims: ['7-day battery life', 'Always-on Retina display', 'Dual-frequency GPS'],
      forbiddenClaims: ['Never needs charging', 'Medical grade ECG diagnostics'],
      maxBatteryLifeHours: 168,
      waterResistanceRating: '5ATM (50 meters swimming)',
    },
  ],
  terminologyRules: [
    { id: 'term-1', term: 'Waterproof', correction: 'Water-resistant', reason: 'Legal compliance: No consumer electronic is 100% waterproof.', category: 'forbidden', context: 'All external collateral' },
    { id: 'term-2', term: 'AI Brain', correction: 'Droplet Neural Engine', reason: 'Brand terminology: Must use official trademarked hardware nomenclature.', category: 'mandatory', context: 'Technical specs & PR' },
    { id: 'term-3', term: 'Infinite Battery', correction: 'Long-lasting battery', reason: 'Factual accuracy: Battery life is strictly bounded by hardware capacity.', category: 'forbidden', context: 'Marketing ads' },
    { id: 'term-4', term: 'Instant', correction: 'High-speed / Responsive', reason: 'Avoid absolute superlatives unless benchmarked.', category: 'preferred', context: 'Product messaging' },
  ],
  toneOfVoice: {
    formality: 75,
    enthusiasm: 60,
    technicalDepth: 80,
    guidelinesText: 'Maintain an authoritative yet approachable enterprise tone. Avoid slang, over-promising superlatives, and informal greetings in external marketing collateral.',
  },
  visualAssets: [
    { id: 'va-1', name: 'Droplet Master Logotype (Dark)', type: 'logo', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80', minClearancePx: 24 },
    { id: 'va-2', name: 'Droplet Icon Glyph (Cyan)', type: 'icon', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80', minClearancePx: 16 },
    { id: 'va-3', name: 'Product Banner Grid', type: 'banner', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', minClearancePx: 32 },
  ],
  colorPalette: [
    { id: 'c-1', name: 'Droplet Slate', hex: '#0f172a', type: 'solid', role: 'background' },
    { id: 'c-2', name: 'Enterprise Indigo', hex: '#6366f1', type: 'solid', role: 'primary' },
    { id: 'c-3', name: 'Neural Cyan', hex: '#06b6d4', type: 'solid', role: 'accent' },
    { id: 'c-4', name: 'Cyber Neon Gradient', hex: '#6366f1', type: 'gradient', gradientStop: '#06b6d4', gradientAngle: 135, gradientType: 'linear', role: 'primary' },
    { id: 'c-5', name: 'Success Emerald', hex: '#10b981', type: 'solid', role: 'secondary' },
    { id: 'c-6', name: 'Compliance Rose', hex: '#f43f5e', type: 'solid', role: 'warning' },
  ],
};

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Victoria Vance',
    email: 'victoria.v@droplet.ai',
    role: 'Brand Owner / Admin',
    department: 'Executive Governance',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    personalComplianceScore: 98,
    historyScores: [
      { date: 'Oct 1', score: 94, label: 'Policy Review' },
      { date: 'Oct 10', score: 96, label: 'Q3 Sign-off' },
      { date: 'Oct 20', score: 98, label: 'Audit Master' },
      { date: 'Nov 1', score: 99, label: 'Governance v4' },
    ]
  },
  {
    id: 'tm-2',
    name: 'Marcus Sterling',
    email: 'marcus.s@droplet.ai',
    role: 'Marketing Manager',
    department: 'Global Marketing',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    personalComplianceScore: 89,
    historyScores: [
      { date: 'Oct 1', score: 82, label: 'Whitepaper 1' },
      { date: 'Oct 12', score: 86, label: 'Campaign Brief' },
      { date: 'Oct 24', score: 88, label: 'Product Teaser' },
      { date: 'Nov 2', score: 91, label: 'Q4 Launch' },
    ]
  },
  {
    id: 'tm-3',
    name: 'Elena Rostova',
    email: 'elena.r@droplet.ai',
    role: 'Content Creator',
    department: 'Copywriting',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    personalComplianceScore: 84,
    historyScores: [
      { date: 'Oct 5', score: 76, label: 'Initial Blog' },
      { date: 'Oct 14', score: 80, label: 'Social Copy' },
      { date: 'Oct 25', score: 82, label: 'Ad Copy #3' },
      { date: 'Nov 3', score: 88, label: 'Press Release' },
    ]
  },
  {
    id: 'tm-4',
    name: 'Javier Gomez',
    email: 'javier.g@droplet.ai',
    role: 'Graphic Designer',
    department: 'Visual Design',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    personalComplianceScore: 92,
    historyScores: [
      { date: 'Oct 8', score: 88, label: 'Banner Set A' },
      { date: 'Oct 17', score: 90, label: 'Logo Revisions' },
      { date: 'Oct 29', score: 94, label: 'Social Kit' },
      { date: 'Nov 4', score: 95, label: 'Watch Hero' },
    ]
  },
  {
    id: 'tm-5',
    name: 'Dr. Aris Thorne',
    email: 'aris.t@droplet.ai',
    role: 'Authorised Reviewer',
    department: 'Legal & Compliance',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    personalComplianceScore: 97,
    historyScores: [
      { date: 'Oct 2', score: 95, label: 'Regulatory' },
      { date: 'Oct 15', score: 96, label: 'Contract Vetting' },
      { date: 'Oct 28', score: 98, label: 'Patent Review' },
      { date: 'Nov 4', score: 98, label: 'Q4 Final' },
    ]
  },
];

export const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'audit-101',
    title: 'Q4 Global Product Launch Press Release',
    type: 'document',
    brandId: 'b-1',
    brandName: 'Droplet Core Hardware',
    author: 'Elena Rostova',
    authorEmail: 'elena.r@droplet.ai',
    department: 'Copywriting',
    createdAt: '2026-11-04 10:30 AM',
    status: 'Pending Review',
    complianceScore: 78,
    contentBody: `FOR IMMEDIATE RELEASE:\n\nDroplet AI announces the upcoming release of the Droplet Pod Pro X. Featuring our revolutionary AI Brain technology, these headphones are completely waterproof and offer infinite battery life up to 100 hours of continuous playback. Experience audio perfection with instant wireless synchronization.\n\n"We have redefined what acoustic hardware can achieve," says Marcus Sterling, VP of Marketing.`,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    issues: [
      {
        id: 'iss-1',
        category: 'Unsupported Claims',
        severity: 'high',
        title: 'Forbidden Battery Claim ("infinite battery life up to 100 hours")',
        description: 'Product specification strictly bounds Droplet Pod Pro X to 24 hours continuous playback with ANC enabled.',
        sourcePassage: 'Verified Metric: 24-hour continuous playback with ANC enabled',
        suggestedFix: 'Replace with "Up to 24-hour continuous playback with ANC enabled".',
        status: 'pending'
      },
      {
        id: 'iss-2',
        category: 'Factual Inconsistencies',
        severity: 'high',
        title: 'Prohibited Term ("completely waterproof")',
        description: 'Brand guideline requires "Water-resistant" (IPX7 rating). No electronic is fully waterproof under legal terms.',
        sourcePassage: 'Terminology Rule: Waterproof -> Water-resistant (IPX7)',
        suggestedFix: 'Replace "completely waterproof" with "IPX7 water-resistant".',
        status: 'pending'
      },
      {
        id: 'iss-3',
        category: 'Tone Mismatches',
        severity: 'medium',
        title: 'Non-Standard Nomenclature ("AI Brain")',
        description: 'Brand guideline requires official trademarked hardware nomenclature.',
        sourcePassage: 'Terminology Rule: AI Brain -> Droplet Neural Engine',
        suggestedFix: 'Replace "AI Brain" with "Droplet Neural Engine".',
        status: 'pending'
      },
      {
        id: 'iss-4',
        category: 'Tone Mismatches',
        severity: 'low',
        title: 'Overuse of Absolute Superlatives ("audio perfection", "instant")',
        description: 'Tone guidelines discourage unverified absolute superlatives in external press releases.',
        sourcePassage: 'Tone of Voice: Authoritative yet approachable, avoid hyperbolic superlatives.',
        suggestedFix: 'Refine "audio perfection" to "exceptional acoustic fidelity".',
        status: 'pending'
      }
    ],
    revisionHistory: [
      { id: 'rev-1', timestamp: '2026-11-04 10:30 AM', author: 'Elena Rostova', action: 'Submitted for Audit', note: 'Initial draft for Q4 launch campaign' },
      { id: 'rev-2', timestamp: '2026-11-04 10:31 AM', author: 'Droplet Gemini AI Agent', action: 'Automated Audit Complete', note: 'Scanned against 24 guidelines. 4 compliance flags detected.' }
    ]
  },
  {
    id: 'audit-102',
    title: 'Instagram Ad Banner - Ultra Watch 7 Days',
    type: 'ad',
    brandId: 'b-1',
    brandName: 'Droplet Core Hardware',
    author: 'Javier Gomez',
    authorEmail: 'javier.g@droplet.ai',
    department: 'Visual Design',
    createdAt: '2026-11-04 09:15 AM',
    status: 'Approved',
    complianceScore: 98,
    contentBody: 'Droplet Ultra Watch. 7-day battery life. Dual-frequency GPS. Always-on Retina display. Engineered for endurance.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    issues: [
      {
        id: 'iss-5',
        category: 'Visual Errors',
        severity: 'low',
        title: 'Logo Clearance Check',
        description: 'Brand logotype in bottom right corner is 24px from edge.',
        sourcePassage: 'Visual Asset Rule: Min clearance 24px',
        suggestedFix: 'Asset aligns with 24px boundary.',
        status: 'accepted'
      }
    ],
    revisionHistory: [
      { id: 'rev-3', timestamp: '2026-11-04 09:15 AM', author: 'Javier Gomez', action: 'Submitted for Audit', note: 'Social ad variant A' },
      { id: 'rev-4', timestamp: '2026-11-04 09:16 AM', author: 'Dr. Aris Thorne', action: 'Passed Audit & Approved', note: 'Score 98% - Signed off for direct publishing' }
    ]
  },
  {
    id: 'audit-103',
    title: 'Enterprise Cloud Security Whitepaper Summary',
    type: 'text',
    brandId: 'b-2',
    brandName: 'Droplet Enterprise Cloud',
    author: 'Marcus Sterling',
    authorEmail: 'marcus.s@droplet.ai',
    department: 'Global Marketing',
    createdAt: '2026-11-03 16:40 PM',
    status: 'Changes Requested',
    complianceScore: 82,
    contentBody: 'Droplet Cloud delivers enterprise-grade security with low latency worldwide. Our decentralized clusters ensure data sovereignty.',
    issues: [
      {
        id: 'iss-6',
        category: 'Unsupported Claims',
        severity: 'high',
        title: 'Absolute Claim ("impenetrable security")',
        description: 'Enterprise compliance prohibits absolute security guarantees.',
        sourcePassage: 'Compliance Rules: No absolute security guarantees.',
        suggestedFix: 'Replace with "enterprise-grade encryption".',
        status: 'pending'
      }
    ],
    revisionHistory: [
      { id: 'rev-5', timestamp: '2026-11-03 16:40 PM', author: 'Marcus Sterling', action: 'Submitted for Audit', note: 'Whitepaper intro' },
      { id: 'rev-6', timestamp: '2026-11-03 17:00 PM', author: 'Dr. Aris Thorne', action: 'Changes Requested', note: 'Please revise absolute security claims.' }
    ]
  }
];
