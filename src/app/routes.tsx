import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { MapShell } from "@/layout/MapShell/MapShell";
import { NotamGeometryTestPage } from "@/test/NotamGeometryTestPage";

export const routes = [
  { path: "/", element: <Navigate to="/airplanes" replace /> },
  { path: "/test/notam-geometry", element: <NotamGeometryTestPage /> },
  {
    path: "/:tool",
    element: <MapShell />,
  },
];

export const router = createBrowserRouter(routes);
