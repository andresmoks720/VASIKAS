import { useCallback } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";

import { NormalizedNotam } from "./notamTypes";
import { normalizeNotams } from "./notamInterpreter";

export function useNotamStream() {
  const url = ENV.notamUrl();
  const pollMs = ENV.poll.notamMs();

  const mapper = useCallback(
    (raw: unknown) => normalizeNotams(raw, new Date().toISOString()),
    [],
  );

  return usePolling<NormalizedNotam[]>(`notam:${url}`, url, pollMs, mapper);
}
