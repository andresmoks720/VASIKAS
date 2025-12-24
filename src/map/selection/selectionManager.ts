import Feature from "ol/Feature";

import { EntityRef } from "@/layout/MapShell/urlState";

type FeatureResolver = (entity: EntityRef) => Feature[];

type SelectionState = {
  entity: EntityRef | null;
  features: Feature[];
};

function isSameEntity(left: EntityRef | null, right: EntityRef | null): boolean {
  if (!left || !right) {
    return false;
  }

  return left.kind === right.kind && left.id === right.id;
}

export function createSelectionManager(resolveFeatures: FeatureResolver) {
  let state: SelectionState = { entity: null, features: [] };

  const clearSelection = () => {
    state.features.forEach((feature) => {
      feature.set("selected", false);
    });
    state = { entity: null, features: [] };
  };

  const applySelection = (entity: EntityRef) => {
    const features = resolveFeatures(entity);
    features.forEach((feature) => {
      feature.set("selected", true);
    });
    state = { entity, features };
  };

  const setSelectedEntity = (entity: EntityRef | null) => {
    if (!entity) {
      if (state.entity) {
        clearSelection();
      }
      return;
    }

    if (isSameEntity(state.entity, entity)) {
      clearSelection();
      applySelection(entity);
      return;
    }

    if (state.entity) {
      clearSelection();
    }
    applySelection(entity);
  };

  return {
    setSelectedEntity,
  };
}
