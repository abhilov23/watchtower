export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type MonitorStatus = "ACTIVE" | "PAUSED";

export type WebsiteStatus = "UP" | "DOWN" | "UNKNOWN";

export interface Region {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  flag?: string;
}

export interface WebsiteRegion {
  websiteId: string;
  regionId: string;
  region: Region;
}

export interface WebsiteTick {
  id: string;
  responseTimeMs: number;
  status: WebsiteStatus;
  statusCode?: number | null;
  regionId: string;
  region?: Region;
  websiteId: string;
  createdAt: string;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  intervalSeconds: number;
  timeoutMs: number;
  expectedStatusCode: number;
  monitorStatus: MonitorStatus;
  userId?: string;
  regions: WebsiteRegion[];
  ticks?: WebsiteTick[];
  createdAt: string;
  updatedAt: string;
  
  // Computed client-side metrics
  currentStatus?: WebsiteStatus;
  lastResponseTimeMs?: number;
  uptimePercentage?: number;
  lastCheckedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface StatusPage {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isPublished: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicStatusPageData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  overallStatus: "OPERATIONAL" | "DEGRADED";
  updatedAt: string;
  monitors: Array<{
    id: string;
    name: string;
    url: string;
    method: string;
    status: "UP" | "DOWN" | "UNKNOWN";
    lastChecked: string;
    responseTimeMs: number;
  }>;
}
