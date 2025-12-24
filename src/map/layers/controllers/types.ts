import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { EntityRef } from "@/layout/MapShell/urlState";

export type LayerController<TData> = {
  layer: VectorLayer<VectorSource>;
  setData: (data: TData) => void;
  setSelection?: (entity: EntityRef | null) => void;
  dispose: () => void;
};
