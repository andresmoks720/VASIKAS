import { promises as fs } from "node:fs";
import path from "node:path";
import { normalizeUnifiedRestrictions } from "./index";

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

const outputPath = getArg("--out") ?? "out.json";

const output = await normalizeUnifiedRestrictions();
const absolutePath = path.resolve(process.cwd(), outputPath);
await fs.writeFile(absolutePath, JSON.stringify(output, null, 2));

// eslint-disable-next-line no-console
console.log(`Wrote unified restriction output to ${absolutePath}`);
