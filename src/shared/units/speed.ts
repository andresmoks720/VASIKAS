type SpeedUnit = "mps" | "kmh";

const formatNumber = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(1);

export const formatSpeed = (value: number | null, unit: SpeedUnit = "mps") => {
  if (value == null) {
    return "Unknown speed";
  }

  const formattedNumber = formatNumber(unit === "mps" ? value : value);
  const suffix = unit === "mps" ? "m/s" : "km/h";

  return `${formattedNumber} ${suffix}`;
};
