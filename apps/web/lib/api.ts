import { Website, Region, User } from "./types";
import { getStoredWebsites, saveStoredWebsites, DEFAULT_REGIONS, getStoredUser, setStoredUser } from "./store";

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { credentials: "include", ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
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
      const data = await res.json();
      if (res.ok && data.success) {
        const user: User = data.data || { id: "u-" + Date.now(), username, email };
        setStoredUser(user);
        return { success: true, user };
      }
      if (!res.ok) {
        return { success: false, message: data.message || "Registration failed" };
      }
    } catch {
      // Backend not running / fallback
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
      const data = await res.json();
      if (res.ok && data.success) {
        const user: User = data.data || { id: "u-" + Date.now(), username: identifier, email: `${identifier}@example.com` };
        setStoredUser(user);
        return { success: true, user };
      }
      if (!res.ok) {
        return { success: false, message: data.message || "Invalid credentials" };
      }
    } catch {
      // Backend not running / fallback
    }

    // Client fallback
    const user: User = { id: "u-" + Date.now(), username: identifier, email: identifier.includes("@") ? identifier : `${identifier}@watchtower.dev` };
    setStoredUser(user);
    return { success: true, user };
  },

  async logout(): Promise<void> {
    try {
      await fetchWithTimeout("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setStoredUser(null);
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetchWithTimeout("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setStoredUser(data.data);
          return data.data;
        }
      }
    } catch {
      // ignore
    }
    return getStoredUser();
  },

  // Region APIs
  async getRegions(): Promise<Region[]> {
    try {
      const res = await fetchWithTimeout("/api/regions");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          return data.data;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_REGIONS;
  },

  // Website APIs
  async getWebsites(): Promise<Website[]> {
    try {
      const res = await fetchWithTimeout("/api/websites");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          return data.data;
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
        if (data.success && data.data) {
          return data.data;
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
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
    } catch {
      // fallback
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
      regions: selectedRegions.map((r) => ({
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

  async togglePause(id: string, currentStatus: "ACTIVE" | "PAUSED"): Promise<Website | null> {
    const isPaused = currentStatus === "PAUSED";
    const endpoint = isPaused ? `/api/websites/${id}/resume` : `/api/websites/${id}/pause`;
    try {
      const res = await fetchWithTimeout(endpoint, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data.data;
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
      if (res.ok) return true;
    } catch {
      // fallback
    }
    const current = getStoredWebsites();
    const updated = current.filter((w) => w.id !== id);
    saveStoredWebsites(updated);
    return true;
  },
};
