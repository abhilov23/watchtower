import { Website, Region, WebsiteTick, User, StatusPage } from "./types";

export const DEFAULT_REGIONS: Region[] = [
  { id: "reg-us-east", name: "US East (N. Virginia)", code: "us-east-1", enabled: true, flag: "🇺🇸" },
  { id: "reg-eu-central", name: "EU Central (Frankfurt)", code: "eu-central-1", enabled: true, flag: "🇩🇪" },
  { id: "reg-ap-south", name: "Asia South (Mumbai)", code: "ap-south-1", enabled: true, flag: "🇮🇳" },
  { id: "reg-ap-northeast", name: "Asia Pacific (Tokyo)", code: "ap-northeast-1", enabled: true, flag: "🇯🇵" },
  { id: "reg-us-west", name: "US West (Oregon)", code: "us-west-2", enabled: true, flag: "🇺🇸" },
  { id: "reg-eu-west", name: "EU West (London)", code: "eu-west-1", enabled: true, flag: "🇬🇧" },
];

function getRegion(index: number): Region {
  return DEFAULT_REGIONS[index] || DEFAULT_REGIONS[0] as Region;
}

function generateTicks(count: number, baseMs: number, failRatio: number = 0.02): WebsiteTick[] {
  const ticks: WebsiteTick[] = [];
  const now = Date.now();
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 1000).toISOString();
    const isDown = Math.random() < failRatio;
    const responseTimeMs = isDown ? 0 : Math.floor(baseMs + (Math.random() * 25 - 12));
    const reg = getRegion(Math.floor(Math.random() * DEFAULT_REGIONS.length));
    
    ticks.push({
      id: `tick-${i}-${Math.random().toString(36).substring(7)}`,
      websiteId: "mock",
      regionId: reg.id,
      status: isDown ? "DOWN" : "UP",
      statusCode: isDown ? 502 : 200,
      responseTimeMs: Math.max(12, responseTimeMs),
      createdAt: timestamp,
    });
  }
  return ticks;
}

export const INITIAL_WEBSITES: Website[] = [
  {
    id: "web-1",
    name: "Production API Gateway",
    url: "https://api.watchtower.dev/health",
    method: "GET",
    intervalSeconds: 30,
    timeoutMs: 5000,
    expectedStatusCode: 200,
    monitorStatus: "ACTIVE",
    currentStatus: "UP",
    lastResponseTimeMs: 42,
    uptimePercentage: 99.98,
    lastCheckedAt: new Date(Date.now() - 15000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    regions: [
      { websiteId: "web-1", regionId: "reg-us-east", region: getRegion(0) },
      { websiteId: "web-1", regionId: "reg-eu-central", region: getRegion(1) },
      { websiteId: "web-1", regionId: "reg-ap-south", region: getRegion(2) },
    ],
    ticks: generateTicks(40, 42, 0.01),
  },
  {
    id: "web-2",
    name: "Stripe Payment Webhook",
    url: "https://pay.watchtower.dev/webhooks/status",
    method: "POST",
    intervalSeconds: 60,
    timeoutMs: 10000,
    expectedStatusCode: 200,
    monitorStatus: "ACTIVE",
    currentStatus: "UP",
    lastResponseTimeMs: 68,
    uptimePercentage: 100.0,
    lastCheckedAt: new Date(Date.now() - 25000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    regions: [
      { websiteId: "web-2", regionId: "reg-us-east", region: getRegion(0) },
      { websiteId: "web-2", regionId: "reg-eu-central", region: getRegion(1) },
    ],
    ticks: generateTicks(40, 68, 0.0),
  },
  {
    id: "web-3",
    name: "Customer Auth Service",
    url: "https://auth.watchtower.dev/.well-known/jwks.json",
    method: "GET",
    intervalSeconds: 60,
    timeoutMs: 8000,
    expectedStatusCode: 200,
    monitorStatus: "ACTIVE",
    currentStatus: "UP",
    lastResponseTimeMs: 31,
    uptimePercentage: 99.94,
    lastCheckedAt: new Date(Date.now() - 40000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    regions: [
      { websiteId: "web-3", regionId: "reg-us-east", region: getRegion(0) },
      { websiteId: "web-3", regionId: "reg-us-west", region: getRegion(4) },
    ],
    ticks: generateTicks(40, 31, 0.02),
  },
  {
    id: "web-4",
    name: "Global Edge Assets (CDN)",
    url: "https://cdn.watchtower.dev/ping",
    method: "HEAD",
    intervalSeconds: 120,
    timeoutMs: 5000,
    expectedStatusCode: 200,
    monitorStatus: "PAUSED",
    currentStatus: "UNKNOWN",
    lastResponseTimeMs: 18,
    uptimePercentage: 99.85,
    lastCheckedAt: new Date(Date.now() - 360000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    regions: [
      { websiteId: "web-4", regionId: "reg-ap-northeast", region: getRegion(3) },
      { websiteId: "web-4", regionId: "reg-eu-central", region: getRegion(1) },
    ],
    ticks: generateTicks(40, 18, 0.0),
  },
];

const STORAGE_KEY = "watchtower_websites_v1";
const USER_KEY = "watchtower_user_v1";

export function getStoredWebsites(): Website[] {
  if (typeof window === "undefined") return INITIAL_WEBSITES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WEBSITES));
      return INITIAL_WEBSITES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_WEBSITES;
  }
}

export function saveStoredWebsites(websites: Website[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
  } catch (err) {
    console.error("Failed to save websites to localStorage", err);
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      const defaultUser: User = { id: "demo-user", username: "alex_engineer", email: "alex@watchtower.dev" };
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

const STATUS_PAGES_KEY = "watchtower_status_pages_v1";

export const INITIAL_STATUS_PAGES: StatusPage[] = [
  {
    id: "sp-default",
    name: "Watchtower Live Status",
    slug: "watchtower-live",
    description: "Official real-time operational status for all Watchtower platform endpoints and edge clusters.",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getStoredStatusPages(): StatusPage[] {
  if (typeof window === "undefined") return INITIAL_STATUS_PAGES;
  try {
    const raw = localStorage.getItem(STATUS_PAGES_KEY);
    if (!raw) {
      localStorage.setItem(STATUS_PAGES_KEY, JSON.stringify(INITIAL_STATUS_PAGES));
      return INITIAL_STATUS_PAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATUS_PAGES;
  }
}

export function saveStoredStatusPages(pages: StatusPage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATUS_PAGES_KEY, JSON.stringify(pages));
  } catch (err) {
    console.error("Failed to save status pages", err);
  }
}
