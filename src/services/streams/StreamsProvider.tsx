import React, { createContext, PropsWithChildren, useContext } from "react";

import { useAdsbStream } from "@/services/adsb/adsbClient";
import { useDronesStream } from "@/services/drones/droneClient";
import { useSensorsStream } from "@/services/sensors/sensorsClient";
import { useNotamStream } from "@/services/notam/notamStream";

type StreamContextValue = {
  adsb: ReturnType<typeof useAdsbStream>;
  drones: ReturnType<typeof useDronesStream>;
  sensors: ReturnType<typeof useSensorsStream>;
  notams: ReturnType<typeof useNotamStream>;
};

const StreamsContext = createContext<StreamContextValue | null>(null);

export function StreamsProvider({ children }: PropsWithChildren) {
  const adsb = useAdsbStream();
  const drones = useDronesStream();
  const sensors = useSensorsStream();
  const notams = useNotamStream();

  return (
    <StreamsContext.Provider value={{ adsb, drones, sensors, notams }}>
      {children}
    </StreamsContext.Provider>
  );
}

function useStreamsContext(): StreamContextValue {
  const ctx = useContext(StreamsContext);
  if (!ctx) {
    throw new Error("StreamsProvider is missing in the component tree");
  }

  return ctx;
}

export function useSharedAdsbStream() {
  return useStreamsContext().adsb;
}

export function useSharedDronesStream() {
  return useStreamsContext().drones;
}

export function useSharedSensorsStream() {
  return useStreamsContext().sensors;
}

export function useSharedNotamStream() {
  return useStreamsContext().notams;
}
