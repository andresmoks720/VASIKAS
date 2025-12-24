import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

type RenderWithRouterOptions = RenderOptions & {
  route?: string;
  path?: string;
};

export function renderWithRouter(
  ui: React.ReactElement,
  { route = "/air", path = "/:tool", ...options }: RenderWithRouterOptions = {},
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>,
    options,
  );
}
