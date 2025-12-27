import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { normalizeNotams } from "@/services/notam/notamNormalizer";

const [, , inputPath] = process.argv;

if (!inputPath) {
  console.error("Usage: tsx scripts/notam-geometry-report.ts <path-to-notam-json>");
  process.exit(1);
}

const resolvedPath = resolve(process.cwd(), inputPath);
const raw = JSON.parse(readFileSync(resolvedPath, "utf8"));

const notams = normalizeNotams(raw, new Date().toISOString());

const summary = notams.reduce(
  (acc, notam) => {
    acc.total += 1;
    if (notam.geometry) {
      acc.rendered += 1;
    } else {
      acc.skipped += 1;
      const reason = notam.geometryParseReason ?? "UNKNOWN";
      acc.byReason[reason] = (acc.byReason[reason] ?? 0) + 1;
      if (!acc.examples[reason]) {
        acc.examples[reason] = [];
      }
      if (acc.examples[reason].length < 3) {
        acc.examples[reason].push(notam.id);
      }
    }
    return acc;
  },
  {
    total: 0,
    rendered: 0,
    skipped: 0,
    byReason: {} as Record<string, number>,
    examples: {} as Record<string, string[]>,
  },
);

console.log("NOTAM geometry report");
console.log(`Total: ${summary.total}`);
console.log(`Rendered: ${summary.rendered}`);
console.log(`Skipped: ${summary.skipped}`);
console.log("By reason:");
for (const [reason, count] of Object.entries(summary.byReason)) {
  const examples = summary.examples[reason]?.join(", ") ?? "";
  console.log(`- ${reason}: ${count}${examples ? ` (e.g. ${examples})` : ""}`);
}
