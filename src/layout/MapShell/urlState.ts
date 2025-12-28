export const TOOLS = [
  "air",
  "sensors",
  "geofences",
  "notams",
  "known-drones",
  "history",
] as const;

export type Tool = (typeof TOOLS)[number];

const ENTITY_KINDS = ["drone", "aircraft", "flight", "sensor", "geofence", "notam", "object"] as const;

export type EntityKind = (typeof ENTITY_KINDS)[number];

export type EntityRef = {
  kind: EntityKind;
  id: string;
};

function isTool(value: string): value is Tool {
  return TOOLS.includes(value as Tool);
}

function isEntityKind(value: string): value is EntityKind {
  return ENTITY_KINDS.includes(value as EntityKind);
}

export function parseTool(value: string | null | undefined): Tool | null {
  if (!value) {
    return null;
  }

  return isTool(value) ? value : null;
}

export function parseEntity(value: string | null | undefined): EntityRef | null {
  if (!value) {
    return null;
  }

  const separatorIndex = value.indexOf(":");

  if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
    return null;
  }

  const kind = value.slice(0, separatorIndex);
  const id = value.slice(separatorIndex + 1);

  if (!isEntityKind(kind)) {
    return null;
  }

  return { kind, id };
}

export function formatEntity(entity: EntityRef): string {
  return `${entity.kind}:${entity.id}`;
}
