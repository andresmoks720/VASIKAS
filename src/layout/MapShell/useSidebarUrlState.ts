import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  EntityRef,
  Tool,
  formatEntity,
  parseEntity,
  parseTool,
  TOOLS,
} from "./urlState";

type SidebarState = {
  tool: Tool;
  entity: EntityRef | null;
  historyDate: string | null;
  historyArea: string | null;
  setTool: (tool: Tool) => void;
  selectEntity: (entity: EntityRef | null, options?: { replace?: boolean }) => void;
};

function fallbackTool(toolParam: string | null | undefined): Tool {
  return parseTool(toolParam) ?? TOOLS[0];
}

export function useSidebarUrlState(): SidebarState {
  const navigate = useNavigate();
  const { tool: toolParam } = useParams();
  const [searchParams] = useSearchParams();

  const tool = useMemo(() => fallbackTool(toolParam), [toolParam]);
  const entity = useMemo(
    () => parseEntity(searchParams.get("entity")),
    [searchParams]
  );

  const historyDate = searchParams.get("hDate");
  const historyArea = searchParams.get("hArea");

  const setTool = useCallback(
    (nextTool: Tool) => {
      navigate({ pathname: `/${nextTool}`, search: searchParams.toString() });
    },
    [navigate, searchParams]
  );

  const selectEntity = useCallback(
    (nextEntity: EntityRef | null, options?: { replace?: boolean }) => {
      const newParams = new URLSearchParams(searchParams);

      if (nextEntity) {
        newParams.set("entity", formatEntity(nextEntity));
      } else {
        newParams.delete("entity");
      }

      navigate(
        { pathname: `/${tool}`, search: newParams.toString() },
        { replace: options?.replace ?? true }
      );
    },
    [navigate, searchParams, tool]
  );

  return {
    tool,
    entity,
    historyDate,
    historyArea,
    setTool,
    selectEntity,
  };
}
