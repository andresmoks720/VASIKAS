type SpeedUnit = "mps" | "kmh";

const formatNumber = (value: number) => (Number.isInteger(value) ? value.toString() : value.toFixed(1));

export const formatDroneSpeedMps = (value: number | null) => {
  if (value == null) return "—";
  return `${formatNumber(value)} m/s`;
};

export const formatAircraftSpeedKmh = (value: number | null) => {
  if (value == null) return "—";
  return `${formatNumber(value)} km/h`;
};

export const formatSpeed = (value: number | null, unit: SpeedUnit = "mps") =>
  unit === "kmh" ? formatAircraftSpeedKmh(value) : formatDroneSpeedMps(value);
