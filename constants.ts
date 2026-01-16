import { DocumentType } from "./types";

export const MARKETING_URL = "/";

// Dashboard routes
export const DASHBOARD_HOME_URL = "/dashboard";
export const DASHBOARD_DOCUMENTS_URL = "/dashboard/documents";
export const DASHBOARD_PROFILE_URL = "/dashboard/profile";
export const DASHBOARD_DOCUMENTS_DRAFTS_URL = `${DASHBOARD_DOCUMENTS_URL}/drafts`;
export const DASHBOARD_DOCUMENTS_GROUP_URL = (id: string) =>
  `${DASHBOARD_DOCUMENTS_URL}/group/${id}`;

// Legacy dashboard URL (keep for backward compatibility)
export const DASHBOARD_URL = DASHBOARD_HOME_URL;
export const DASHBOARD_DRAFTS_URL = DASHBOARD_DOCUMENTS_DRAFTS_URL;
export const DASHBOARD_GROUP_URL = DASHBOARD_DOCUMENTS_GROUP_URL;

// Admin routes
export const ADMIN_URL = "/admin";
export const ADMIN_STATISTICS_URL = `${ADMIN_URL}/statistics`;
export const ADMIN_FINANCIALS_URL = `${ADMIN_URL}/financials`;
export const ADMIN_CHECKLISTS_URL = `${ADMIN_URL}/checklists`;
export const ADMIN_BLOG_URL = `${ADMIN_URL}/posts`;

export const DOCUMENT_URL = (type: DocumentType, id: string) =>
  `/${type}/${id}`;
