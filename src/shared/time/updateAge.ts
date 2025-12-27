const DEFAULT_NO_UPDATES_LABEL = "No updates yet";
const DEFAULT_PREFIX = "Updated:";

type UpdateAgeOptions = {
  /**
   * Prefix used before the relative time string.
   * Defaults to "Updated:" to align with polling status copy.
   */
  prefix?: string;
  /**
   * Label used when there has not been a successful update yet.
   * Defaults to "No updates yet".
   */
  noUpdatesLabel?: string;
};

/**
 * Formats a human-readable "last updated" label based on polling age.
 *
 * Use the `ageSeconds` value from `usePolling` to avoid guessing based on mocked
 * timestamps. This keeps the UI consistent with polling intervals and ensures
 * that "just now" does not hide the actual seconds elapsed.
 */
export function formatUpdateAge(
  ageSeconds: number | null,
  options: UpdateAgeOptions = {},
): string {
  if (ageSeconds === null) {
    return options.noUpdatesLabel ?? DEFAULT_NO_UPDATES_LABEL;
  }

  const safeSeconds = Math.max(0, Math.floor(ageSeconds));
  const prefix = options.prefix ?? DEFAULT_PREFIX;

  if (safeSeconds < 60) {
    return `${prefix} ${formatPlural(safeSeconds, "second")} ago`;
  }

  const minutes = Math.floor(safeSeconds / 60);
  return `${prefix} ${formatPlural(minutes, "minute")} ago`;
}

function formatPlural(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}
