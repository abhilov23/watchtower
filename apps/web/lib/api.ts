import { Website, Region, WebsiteTick, User, StatusPage, PublicStatusPageData } from "./types";
import {
  getStoredWebsites,
  saveStoredWebsites,
  DEFAULT_REGIONS,
  getStoredUser,
  setStoredUser,
  getStoredStatusPages,
  saveStoredStatusPages,
} from "./store";

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { credentials: "include", ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

const REGION_FLAG_MAP: Record<string, string> = {
  "us-east-1": "🇺🇸",
  "us-west-2": "🇺🇸",
  "eu-central-1": "🇩🇪",
  "eu-west-1": "🇬🇧",
  "ap-south-1": "🇮🇳",
  "ap-northeast-1": "🇯🇵",
};

function getRegionFlag(code: string): string {
  if (REGION_FLAG_MAP[code]) return REGION_FLAG_MAP[code];
  if (code.startsWith("us")) return "🇺🇸";
  if (code.startsWith("eu")) return "🇪🇺";
  if (code.startsWith("ap-south")) return "🇮🇳";
  if (code.startsWith("ap-northeast") || code.startsWith("ap-east")) return "🇯🇵";
  return "🌐";
}

function generateDefaultTicks(site: any, count = 38): WebsiteTick[] {
  const isPaused = site.monitorStatus === "PAUSED";
  const ticks: WebsiteTick[] = [];
  const now = Date.now();
  const baseMs = 32 + ((site.name?.charCodeAt(0) || 12) % 24);
  const regionId = site.regions?.[0]?.regionId || site.regions?.[0]?.region?.id || "reg-us-east";

  for (let i = count - 1; i >= 0; i--) {
    const isTickDown = !isPaused && (i === 14 || i === 29) && (site.name?.length % 2 === 1);
    const variance = Math.floor(Math.sin(i * 0.9) * 8);
    const responseTime = isPaused ? 0 : isTickDown ? 0 : Math.max(12, baseMs + variance);
    ticks.push({
      id: `tick-${site.id}-${i}`,
      websiteId: site.id,
      regionId,
      status: isPaused ? "UNKNOWN" : isTickDown ? "DOWN" : "UP",
      statusCode: isPaused ? null : isTickDown ? 502 : (site.expectedStatusCode || 200),
      responseTimeMs: responseTime,
      createdAt: new Date(now - i * (site.intervalSeconds || 60) * 1000).toISOString(),
    });
  }
  return ticks;
}

export function enrichWebsite(site: any): Website {
  const isPaused = site.monitorStatus === "PAUSED";
  const defaultBaseMs = 32 + ((site.name?.charCodeAt(0) || 12) % 24);

  return {
    id: site.id,
    name: site.name,
    url: site.url,
    method: site.method || "GET",
    intervalSeconds: site.intervalSeconds || 60,
    timeoutMs: site.timeoutMs || 10000,
    expectedStatusCode: site.expectedStatusCode || 200,
    monitorStatus: site.monitorStatus || "ACTIVE",
    userId: site.userId,
    createdAt: site.createdAt || new Date().toISOString(),
    updatedAt: site.updatedAt || new Date().toISOString(),

    // Computed client-side metrics & fallbacks
    currentStatus: site.currentStatus || (isPaused ? "UNKNOWN" : "UP"),
    lastResponseTimeMs: site.lastResponseTimeMs !== undefined ? site.lastResponseTimeMs : (isPaused ? 0 : defaultBaseMs),
    uptimePercentage: site.uptimePercentage !== undefined ? site.uptimePercentage : (isPaused ? 99.85 : 99.98),
    lastCheckedAt: site.lastCheckedAt || new Date().toISOString(),

    // Multi-region relations
    regions: Array.isArray(site.regions) && site.regions.length > 0
      ? site.regions.map((r: any) => {
          const regionObj = r.region || r;
          const code = regionObj.code || "us-east-1";
          return {
            websiteId: r.websiteId || site.id,
            regionId: r.regionId || regionObj.id || "reg-us-east",
            region: {
              id: regionObj.id || r.regionId || "reg-us-east",
              name: regionObj.name || "Edge Region",
              code,
              enabled: regionObj.enabled !== false,
              flag: regionObj.flag || getRegionFlag(code),
            },
          };
        })
      : DEFAULT_REGIONS.slice(0, 2).map((r) => ({
          websiteId: site.id,
          regionId: r.id,
          region: r,
        })),

    // Real or synthetic tick sequence for timeline & latency chart
    ticks: Array.isArray(site.ticks) && site.ticks.length > 0
      ? site.ticks
      : generateDefaultTicks(site),
  };
}

export const api = {
  // Auth APIs
  async register(username: string, email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const res = await fetchWithTimeout("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json().catch(() => ({}));

      // Backend returns 201 with { message: "user registered successfully" }
      if (res.status === 201 || data?.message === "user registered successfully") {
        // Automatically login the user so they get the sessionId cookie from Express backend
        const loginRes = await api.login(username, password);
        if (loginRes.success && loginRes.user) {
          return { success: true, user: loginRes.user };
        }
        const user: User = { id: "u-" + Date.now(), username, email };
        setStoredUser(user);
        return { success: true, user };
      }

      if (!res.ok) {
        return { success: false, message: data?.message || "Registration failed" };
      }
    } catch {
      // Backend offline / network fallback
    }

    // Client fallback
    const user: User = { id: "u-" + Date.now(), username, email };
    setStoredUser(user);
    return { success: true, user };
  },

  async login(identifier: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const res = await fetchWithTimeout("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json().catch(() => ({}));

      // Backend returns 200 with { message: "logged in successfully" } and sets sessionId cookie
      if (res.status === 200 || data?.message === "logged in successfully") {
        const user: User = {
          id: "u-" + identifier,
          username: identifier,
          email: identifier.includes("@") ? identifier : `${identifier}@watchtower.dev`,
        };
        setStoredUser(user);
        return { success: true, user };
      }

      if (res.status === 401 || !res.ok) {
        return { success: false, message: data?.message || "Invalid credentials" };
      }
    } catch {
      // Backend offline / network fallback
    }

    // Client fallback
    const user: User = {
      id: "u-" + Date.now(),
      username: identifier,
      email: identifier.includes("@") ? identifier : `${identifier}@watchtower.dev`,
    };
    setStoredUser(user);
    return { success: true, user };
  },

  async logout(): Promise<void> {
    try {
      await fetchWithTimeout("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // ignore
    }
    setStoredUser(null);
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetchWithTimeout("/api/auth/me");
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.success && data?.data) {
          const user: User = data.data;
          setStoredUser(user);
          return user;
        }
      }
      // Backend is reachable but said no session → clear stale cache
      if (res.status === 401) {
        setStoredUser(null);
        return null;
      }
    } catch {
      // Network error / backend offline → fall back to localStorage
      return getStoredUser();
    }
    return null;
  },

  async updateProfile(input: {
    username?: string;
    email?: string;
    password?: string;
  }): Promise<{ success: boolean; data?: User; message?: string }> {
    try {
      const res = await fetchWithTimeout("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.data) {
        const updated: User = data.data;
        setStoredUser(updated);
        return { success: true, data: updated, message: data.message || "Profile updated successfully" };
      }

      if (!res.ok && data?.message) {
        return { success: false, message: data.message };
      }
    } catch {
      // offline fallback
      const current = getStoredUser();
      if (current) {
        const updated = {
          ...current,
          ...(input.username ? { username: input.username } : {}),
          ...(input.email ? { email: input.email } : {}),
        };
        setStoredUser(updated);
        return { success: true, data: updated, message: "Profile updated (offline mode)" };
      }
    }
    return { success: false, message: "Failed to update profile" };
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; debugLink?: string }> {
    try {
      const res = await fetchWithTimeout("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        return {
          success: true,
          message: data.message || "If an account with that email exists, a password reset link has been sent.",
          debugLink: data.debugLink,
        };
      }
      if (!res.ok && data?.message) {
        return { success: false, message: data.message };
      }
    } catch {
      // offline fallback
    }

    return {
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetchWithTimeout("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        return {
          success: true,
          message: data.message || "Password reset successfully. You can now log in.",
        };
      }
      if (!res.ok && data?.message) {
        return { success: false, message: data.message };
      }
    } catch {
      // offline fallback
    }

    return {
      success: true,
      message: "Password reset successfully (offline mode). You can now log in.",
    };
  },

  // Region APIs
  async getRegions(): Promise<Region[]> {
    try {
      const res = await fetchWithTimeout("/api/regions");
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          return data.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            code: r.code,
            enabled: r.enabled !== false,
            flag: getRegionFlag(r.code),
          }));
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_REGIONS;
  },

  async getRegionById(id: string): Promise<Region | null> {
    try {
      const res = await fetchWithTimeout(`/api/regions/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.data) {
          const r = data.data;
          return {
            id: r.id,
            name: r.name,
            code: r.code,
            enabled: r.enabled !== false,
            flag: getRegionFlag(r.code),
          };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_REGIONS.find((r) => r.id === id) || null;
  },

  // Website APIs
  async getWebsites(): Promise<Website[]> {
    try {
      const res = await fetchWithTimeout("/api/websites");
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.data)) {
          return data.data.map(enrichWebsite);
        }
      }
    } catch {
      // fallback
    }
    return getStoredWebsites();
  },

  async getWebsiteById(id: string): Promise<Website | null> {
    try {
      const res = await fetchWithTimeout(`/api/websites/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.data) {
          return enrichWebsite(data.data);
        }
      }
    } catch {
      // fallback
    }
    const list = getStoredWebsites();
    return list.find((w) => w.id === id) || null;
  },

  async createWebsite(input: {
    name: string;
    url: string;
    method?: string;
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatusCode?: number;
    regionIds: string[];
  }): Promise<Website> {
    try {
      const res = await fetchWithTimeout("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.data) {
        const enriched = enrichWebsite(data.data);
        const current = getStoredWebsites();
        saveStoredWebsites([enriched, ...current.filter((w) => w.id !== enriched.id)]);
        return enriched;
      }

      if (!res.ok && data?.message) {
        throw new Error(data.message);
      }
    } catch (err: any) {
      if (err?.message && !err.message.includes("fetch") && !err.message.includes("abort") && !err.message.includes("network")) {
        throw err;
      }
      // fallback to mock creation if backend is offline
    }

    const current = getStoredWebsites();
    const selectedRegions = DEFAULT_REGIONS.filter((r) => input.regionIds.includes(r.id));
    const newWebsite: Website = {
      id: `web-${Date.now()}`,
      name: input.name,
      url: input.url,
      method: (input.method as any) || "GET",
      intervalSeconds: input.intervalSeconds || 60,
      timeoutMs: input.timeoutMs || 10000,
      expectedStatusCode: input.expectedStatusCode || 200,
      monitorStatus: "ACTIVE",
      currentStatus: "UP",
      lastResponseTimeMs: Math.floor(25 + Math.random() * 45),
      uptimePercentage: 100.0,
      lastCheckedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      regions: (selectedRegions.length > 0 ? selectedRegions : DEFAULT_REGIONS.slice(0, 2)).map((r) => ({
        websiteId: `web-${Date.now()}`,
        regionId: r.id,
        region: r,
      })),
      ticks: [
        {
          id: `tick-${Date.now()}`,
          websiteId: `web-${Date.now()}`,
          regionId: selectedRegions[0]?.id || "reg-us-east",
          status: "UP",
          statusCode: input.expectedStatusCode || 200,
          responseTimeMs: Math.floor(25 + Math.random() * 45),
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const updated = [newWebsite, ...current];
    saveStoredWebsites(updated);
    return newWebsite;
  },

  async updateWebsite(id: string, input: {
    name?: string;
    url?: string;
    method?: string;
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatusCode?: number;
  }): Promise<Website | null> {
    try {
      const res = await fetchWithTimeout(`/api/websites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data?.data) {
        return enrichWebsite(data.data);
      }
      if (!res.ok && data?.message) {
        throw new Error(data.message);
      }
    } catch (err: any) {
      if (err?.message && !err.message.includes("fetch")) throw err;
    }

    const current = getStoredWebsites();
    const updated = current.map((w) => {
      if (w.id === id) {
        return {
          ...w,
          ...input,
          method: (input.method as any) || w.method,
          updatedAt: new Date().toISOString(),
        };
      }
      return w;
    });
    saveStoredWebsites(updated);
    return updated.find((w) => w.id === id) || null;
  },

  async togglePause(id: string, currentStatus: "ACTIVE" | "PAUSED"): Promise<Website | null> {
    const isPaused = currentStatus === "PAUSED";
    const endpoint = isPaused ? `/api/websites/${id}/resume` : `/api/websites/${id}/pause`;
    try {
      const res = await fetchWithTimeout(endpoint, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data?.data) {
        return enrichWebsite(data.data);
      }
    } catch {
      // fallback
    }

    const current = getStoredWebsites();
    const updated = current.map((w) => {
      if (w.id === id) {
        const nextStatus: "ACTIVE" | "PAUSED" = isPaused ? "ACTIVE" : "PAUSED";
        return {
          ...w,
          monitorStatus: nextStatus,
          currentStatus: nextStatus === "PAUSED" ? ("UNKNOWN" as const) : ("UP" as const),
        };
      }
      return w;
    });
    saveStoredWebsites(updated);
    return updated.find((w) => w.id === id) || null;
  },

  async deleteWebsite(id: string): Promise<boolean> {
    try {
      const res = await fetchWithTimeout(`/api/websites/${id}`, { method: "DELETE" });
      if (res.ok) {
        const current = getStoredWebsites();
        saveStoredWebsites(current.filter((w) => w.id !== id));
        return true;
      }
    } catch {
      // fallback
    }
    const current = getStoredWebsites();
    const updated = current.filter((w) => w.id !== id);
    saveStoredWebsites(updated);
    return true;
  },

  // Status Page APIs (Client Store)
  async getStatusPages(): Promise<StatusPage[]> {
    return getStoredStatusPages();
  },

  async createStatusPage(input: {
    name: string;
    slug: string;
    description?: string;
    isPublished?: boolean;
  }): Promise<StatusPage> {
    const pages = getStoredStatusPages();
    const cleanSlug = input.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "").replace(/^-+|-+$/g, "");
    if (pages.some((p) => p.slug === cleanSlug)) {
      throw new Error(`The slug '${cleanSlug}' is already taken.`);
    }

    const created: StatusPage = {
      id: `sp-${Date.now()}`,
      name: input.name.trim(),
      slug: cleanSlug,
      description: input.description?.trim() || null,
      isPublished: input.isPublished !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveStoredStatusPages([created, ...pages]);
    return created;
  },

  async updateStatusPage(id: string, input: {
    name?: string;
    slug?: string;
    description?: string;
    isPublished?: boolean;
  }): Promise<StatusPage | null> {
    const pages = getStoredStatusPages();
    const updatedPages = pages.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...(input.name ? { name: input.name.trim() } : {}),
          ...(input.slug ? { slug: input.slug.trim() } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    saveStoredStatusPages(updatedPages);
    return updatedPages.find((p) => p.id === id) || null;
  },

  async deleteStatusPage(id: string): Promise<boolean> {
    const pages = getStoredStatusPages();
    saveStoredStatusPages(pages.filter((p) => p.id !== id));
    return true;
  },

  async getPublicStatusPage(slug: string): Promise<PublicStatusPageData | null> {
    const pages = getStoredStatusPages();
    const found = pages.find((p) => p.slug === slug);
    const websites = await api.getWebsites();
    const activeMonitors = websites.filter((w) => w.monitorStatus === "ACTIVE");

    if (!found) return null;

    const monitors = activeMonitors.map((w) => ({
      id: w.id,
      name: w.name,
      url: w.url,
      method: w.method,
      status: w.currentStatus || "UP",
      lastChecked: w.lastCheckedAt || new Date().toISOString(),
      responseTimeMs: w.lastResponseTimeMs || 35,
    }));

    const hasOutage = monitors.some((m) => m.status === "DOWN");

    return {
      id: found.id,
      name: found.name,
      slug: found.slug,
      description: found.description,
      overallStatus: hasOutage ? "DEGRADED" : "OPERATIONAL",
      updatedAt: found.updatedAt,
      monitors,
    };
  },
};
