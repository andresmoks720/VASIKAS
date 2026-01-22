export const DEFAULT_NOTAM_PIB_URL = "https://aim.eans.ee/web/notampib/area24.json";

export type NotamFetchResult = {
  fetchedAt: string;
  payload: unknown;
};

export async function fetchNotamPib(url: string = DEFAULT_NOTAM_PIB_URL): Promise<NotamFetchResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch NOTAM PIB: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as unknown;
  return {
    fetchedAt: new Date().toISOString(),
    payload,
  };
}
