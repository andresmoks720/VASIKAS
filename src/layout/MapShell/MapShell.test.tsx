import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

import { routes } from "@/app/routes";

describe("MapShell routing", () => {
  it("renders the air panel by default and switches tools via toolbar", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/airplanes"],
    });

    render(<RouterProvider router={router} />);

    const user = userEvent.setup();

    expect(screen.getByRole("heading", { name: /airplanes/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /sensors/i }));

    expect(await screen.findByRole("heading", { name: /sensors/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /drones/i }));

    expect(await screen.findByRole("heading", { name: /drones/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /history/i }));

    expect(await screen.findByRole("heading", { name: /history/i })).toBeInTheDocument();
  });
});
