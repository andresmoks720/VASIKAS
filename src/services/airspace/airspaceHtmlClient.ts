import { getText } from "../http/apiClient";

/**
 * Cache for eAIP HTML content to avoid redundant network requests
 */
const htmlCache: {
  [url: string]: {
    html: string;
    fetchedAtUtc: string;
    timestamp: number;
  }
} = {};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Client to fetch eAIP HTML content for airspace data
 */
export async function fetchEaipHtml(options: { signal?: AbortSignal; timeoutMs?: number } = {}): Promise<{ html: string; sourceUrl: string; fetchedAtUtc: string }> {
  // Get the URL from environment variables
  const { ENV } = await import("@/shared/env");
  const url = ENV.airspace.eaipEnr51Url();

  if (!url) {
    throw new Error("VITE_EAIP_ENR51_URL environment variable is not set");
  }

  // Check cache first
  const cached = htmlCache[url];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      html: cached.html,
      sourceUrl: url,
      fetchedAtUtc: cached.fetchedAtUtc,
    };
  }

  try {
    // Use stylized getText with 30s timeout by default
    const html = await getText(url, {
      signal: options.signal,
      timeoutMs: options.timeoutMs || 30000,
    });

    const fetchedAtUtc = new Date().toISOString();

    // Update cache
    htmlCache[url] = {
      html,
      fetchedAtUtc,
      timestamp: Date.now(),
    };

    return {
      html,
      sourceUrl: url,
      fetchedAtUtc,
    };
  } catch (error) {
    console.error(`Failed to fetch eAIP HTML from ${url}:`, error);
    throw error;
  }
}