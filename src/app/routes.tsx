import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { MapShell } from "@/layout/MapShell/MapShell";

export const routes = [
  { path: "/", element: <Navigate to="/air" replace /> },
  {
    path: "/:tool",
    element: <MapShell />,
  },
];

export const router = createBrowserRouter(routes);
