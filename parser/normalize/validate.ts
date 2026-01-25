import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "./schema/schema.json";
import type { RestrictionFeatureCollection } from "./types";

const ajv = new Ajv({ allErrors: true, meta: false, validateSchema: false });
addFormats(ajv);

const validate = ajv.compile(schema);

export function validateUnifiedRestriction(data: RestrictionFeatureCollection): { valid: boolean; errors?: string[] } {
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }

  const errors = validate.errors?.map((error: { instancePath?: string; message?: string }) => {
    const instancePath = "instancePath" in error ? error.instancePath : "";
    return `${instancePath} ${error.message ?? "schema error"}`;
  }) ?? [];
  return { valid: false, errors };
}
