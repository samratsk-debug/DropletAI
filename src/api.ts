const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export interface AuthSession {
  token: string;
  tokenType: string;
  userId: string;
  fullName: string;
  email: string;
  organisationId: string;
  organisationName: string;
  role: string;
}

export interface OrganisationSummary {
  organisationId: string;
  organisationName: string;
  role: string;
}

export interface CurrentUserProfile {
  id: string;
  fullName: string;
  email: string;
}

export interface ApiBrand {
  id: string;
  name: string;
  description?: string;
  organisationId: string;
  createdAt: string;
}

export interface ApiGuideline {
  id: string;
  title: string;
  content: string;
  organisationId: string;
  brandId?: string | null;
  createdAt: string;
}

export interface ApiFact {
  id: string;
  brandId?: string | null;
  title: string;
  content: string;
  source?: string | null;
  verificationStatus: string;
  approvedByEmail?: string | null;
  createdAt?: string;
}

export interface ApiSubmission {
  id: string;
  brandId: string;
  brandName: string;
  title: string;
  contentType: string;
  content: string;
  status: string;
  submittedByEmail: string;
  reviewerEmail?: string | null;
  analysisReport?: {
    riskScore: number;
    riskCategory: string;
    summary: string;
    issuesJson: string;
    aiRecommendations: string;
    createdAt: string;
  } | null;
  createdAt: string;
}

export interface ApiMember {
  membershipId: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
}

export interface ApiDocument {
  id: string;
  brandId?: string | null;
  brandName?: string | null;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  processingStatus: string;
  uploadedByEmail: string;
  createdAt: string;
}

export interface ApiKnowledge {
  organisationId: string;
  brandId?: string | null;
  brandName?: string | null;
  guidelines: ApiGuideline[];
  approvedFacts: ApiFact[];
  documents: ApiDocument[];
  documentSnippets: string[];
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function saveAuthSession(session: AuthSession) {
  sessionStorage.setItem('droplet_session', JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem('droplet_session');
    return raw ? JSON.parse(raw) as AuthSession : null;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem('droplet_session');
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthSession()?.token;
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(typeof FormData !== 'undefined' && init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(`Can't reach the Droplet AI backend at ${API_BASE_URL}. Start the backend and try again.`, 0);
  }

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') || '';
  if (response.ok && (contentType.startsWith('application/octet-stream') || contentType.startsWith('application/pdf'))) {
    return await response.blob() as T;
  }
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload?.message || payload?.detail || payload?.error || `Request failed (${response.status}).`;
    if (response.status === 401) {
      clearAuthSession();
      window.dispatchEvent(new Event('droplet:unauthorized'));
    }
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) })
});

export const api = {
  signup: (body: { fullName: string; email: string; password: string; organisationName: string }) =>
    request<AuthSession>('/api/auth/signup', json('POST', body)),
  login: (body: { email: string; password: string }) =>
    request<AuthSession>('/api/auth/login', json('POST', body)),
  firebaseSignIn: (body: { idToken: string; fullName?: string; organisationName?: string }) =>
    request<AuthSession>('/api/auth/firebase', json('POST', body)),
  getMyOrganisation: () => request<OrganisationSummary>('/api/organisations/me'),
  getOrganisations: () => request<OrganisationSummary[]>('/api/organisations'),
  getOrganisation: (id: string) => request<OrganisationSummary>(`/api/organisations/${id}`),
  createOrganisation: (name: string) => request<OrganisationSummary>('/api/organisations', json('POST', { name })),
  updateOrganisation: (id: string, name: string) => request<OrganisationSummary>(`/api/organisations/${id}`, json('PUT', { name })),
  getMe: () => request<CurrentUserProfile>('/api/users/me'),
  getOrganisationMemberships: () => request<OrganisationSummary[]>('/api/organisations'),
  getCurrentOrganisation: () => request<OrganisationSummary>('/api/organisations/me'),
  getBrands: (orgId: string) => request<ApiBrand[]>(`/api/organisations/${orgId}/brands`),
  createBrand: (orgId: string, body: { name: string; description?: string }) => request<ApiBrand>(`/api/organisations/${orgId}/brands`, json('POST', body)),
  updateBrand: (orgId: string, brandId: string, body: { name: string; description?: string }) => request<ApiBrand>(`/api/organisations/${orgId}/brands/${brandId}`, json('PUT', body)),
  deleteBrand: (orgId: string, brandId: string) => request<void>(`/api/organisations/${orgId}/brands/${brandId}`, { method: 'DELETE' }),
  getGuidelines: (orgId: string) => request<ApiGuideline[]>(`/api/organisations/${orgId}/guidelines`),
  createGuideline: (orgId: string, body: { title: string; content: string; brandId?: string }) => request<ApiGuideline>(`/api/organisations/${orgId}/guidelines`, json('POST', body)),
  updateGuideline: (orgId: string, id: string, body: { title: string; content: string; brandId?: string }) => request<ApiGuideline>(`/api/organisations/${orgId}/guidelines/${id}`, json('PUT', body)),
  deleteGuideline: (orgId: string, id: string) => request<void>(`/api/organisations/${orgId}/guidelines/${id}`, { method: 'DELETE' }),
  getFacts: (orgId: string, brandId?: string) => request<ApiFact[]>(`/api/organisations/${orgId}/facts${brandId ? `?brandId=${encodeURIComponent(brandId)}` : ''}`),
  createFact: (orgId: string, body: { title: string; content: string; source?: string; brandId?: string }) => request<ApiFact>(`/api/organisations/${orgId}/facts`, json('POST', body)),
  setFactStatus: (orgId: string, factId: string, status: string) => request<ApiFact>(`/api/organisations/${orgId}/facts/${factId}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' }),
  deleteFact: (orgId: string, factId: string) => request<void>(`/api/organisations/${orgId}/facts/${factId}`, { method: 'DELETE' }),
  getKnowledge: (orgId: string, brandId?: string) => request<ApiKnowledge>(`/api/organisations/${orgId}/knowledge${brandId ? `?brandId=${encodeURIComponent(brandId)}` : ''}`),
  uploadDocument: (orgId: string, file: File, brandId?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (brandId) form.append('brandId', brandId);
    return request<ApiDocument>(`/api/organisations/${orgId}/documents`, { method: 'POST', body: form });
  },
  getDocuments: (orgId: string, brandId?: string) => request<ApiDocument[]>(`/api/organisations/${orgId}/documents${brandId ? `?brandId=${encodeURIComponent(brandId)}` : ''}`),
  downloadDocument: (orgId: string, documentId: string) => request<Blob>(`/api/organisations/${orgId}/documents/${documentId}/download`).then(blob => blob),
  deleteDocument: (orgId: string, documentId: string) => request<void>(`/api/organisations/${orgId}/documents/${documentId}`, { method: 'DELETE' }),
  getSubmissions: (orgId: string, brandId?: string) => request<ApiSubmission[]>(`/api/organisations/${orgId}/content${brandId ? `?brandId=${encodeURIComponent(brandId)}` : ''}`),
  getSubmission: (orgId: string, id: string) => request<ApiSubmission>(`/api/organisations/${orgId}/content/${id}`),
  createSubmission: (orgId: string, body: { brandId: string; title: string; contentType: string; content: string; reviewerId?: string }) => request<ApiSubmission>(`/api/organisations/${orgId}/content`, json('POST', body)),
  reviewSubmission: (orgId: string, id: string, action: 'APPROVE' | 'REJECT' | 'REQUEST_REVISION', comment?: string) => request<ApiSubmission>(`/api/organisations/${orgId}/content/${id}/review`, json('POST', { action, comment })),
  getReviewLogs: (orgId: string, id: string) => request<Array<{ id: string; actorEmail: string; action: string; comment?: string; createdAt: string }>>(`/api/organisations/${orgId}/content/${id}/logs`),
  getMembers: (orgId: string) => request<ApiMember[]>(`/api/organisations/${orgId}/members`),
  addMember: (orgId: string, email: string, role: string) => request<unknown>(`/api/organisations/${orgId}/members`, json('POST', { email, role })),
  updateMemberRole: (orgId: string, membershipId: string, role: string) => request<unknown>(`/api/organisations/${orgId}/members/${membershipId}/role`, json('PUT', { role })),
  removeMember: (orgId: string, membershipId: string) => request<unknown>(`/api/organisations/${orgId}/members/${membershipId}`, { method: 'DELETE' })
};

export function currentOrganisationId() {
  return getAuthSession()?.organisationId || '';
}
