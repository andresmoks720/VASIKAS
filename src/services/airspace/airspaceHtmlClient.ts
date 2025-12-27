/**
 * Client to fetch eAIP HTML content for airspace data
 */
export async function fetchEaipHtml(): Promise<{ html: string; sourceUrl: string; fetchedAtUtc: string }> {
  // Get the URL from environment variables
  const { ENV } = await import("@/shared/env");
  const url = ENV.airspace.eaipEnr51Url();
  
  if (!url) {
    throw new Error("VITE_EAIP_ENR51_URL environment variable is not set");
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch eAIP HTML: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    return {
      html,
      sourceUrl: url,
      fetchedAtUtc: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to fetch eAIP HTML from ${url}:`, error);
    throw error;
  }
}