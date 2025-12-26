import React from "react";
import { render, screen } from "@testing-library/react";

import { HistoryPanel } from "./HistoryPanel";

describe("HistoryPanel", () => {
  it("renders heading and omits details when empty", () => {
    render(<HistoryPanel historyDate={null} historyArea={null} />);

    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.queryByText(/Date:/)).toBeNull();
    expect(screen.queryByText(/Area:/)).toBeNull();
  });

  it("renders date and area when provided", () => {
    render(<HistoryPanel historyDate="2025-01-01" historyArea="T1" />);

    expect(screen.getByText("Date: 2025-01-01")).toBeInTheDocument();
    expect(screen.getByText("Area: T1")).toBeInTheDocument();
  });
});
