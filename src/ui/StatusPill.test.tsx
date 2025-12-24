import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
  it("renders the label for the polling status", () => {
    render(<StatusPill status="stale" />);

    expect(screen.getByText("Stale")).toBeInTheDocument();
  });
});
