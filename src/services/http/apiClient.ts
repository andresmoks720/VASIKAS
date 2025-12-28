export type ApiErrorKind = "network" | "http" | "parse";

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  url: string;

  constructor({
    kind,
    status,
    url,
    message,
  }: {
    kind: ApiErrorKind;
    status?: number;
    url: string;
    message: string;
  }) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.url = url;
  }
}

export function withTimeout(
  signal: AbortSignal | undefined,
  timeoutMs?: number,
): { signal: AbortSignal | undefined; clear: () => void } {
  if (!timeoutMs || timeoutMs <= 0) {
    return { signal, clear: () => { } };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const abortListener = () => {
    controller.abort();
  };

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", abortListener);
    }
  }

  const clear = () => {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener("abort", abortListener);
    }
  };

  return { signal: controller.signal, clear };
}

export async function getJson<T>(
  url: string,
  options: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<T> {
  const { signal: mergedSignal, clear } = withTimeout(
    options.signal,
    options.timeoutMs,
  );

  try {
    console.log(`[apiClient] Fetching ${url}`);
    const response = await fetch(url, { signal: mergedSignal, cache: "no-store" });

    if (!response.ok) {
      throw new ApiError({
        kind: "http",
        status: response.status,
        url,
        message: `Request failed with status ${response.status} ${response.statusText}`,
      });
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new ApiError({
        kind: "parse",
        url,
        message: "Failed to parse JSON response",
      });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError({
      kind: "network",
      url,
      message: "Network request failed",
    });
  } finally {
    clear();
  }
}

export async function getText(
  url: string,
  options: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<string> {
  const { signal: mergedSignal, clear } = withTimeout(
    options.signal,
    options.timeoutMs,
  );

  try {
    console.log(`[apiClient] Fetching ${url}`);
    const response = await fetch(url, { signal: mergedSignal, cache: "no-store" });

    if (!response.ok) {
      throw new ApiError({
        kind: "http",
        status: response.status,
        url,
        message: `Request failed with status ${response.status} ${response.statusText}`,
      });
    }

    try {
      return await response.text();
    } catch (error) {
      throw new ApiError({
        kind: "parse",
        url,
        message: "Failed to read text response",
      });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError({
      kind: "network",
      url,
      message: "Network request failed",
    });
  } finally {
    clear();
  }
}
