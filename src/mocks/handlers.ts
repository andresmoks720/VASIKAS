import { http } from "msw";

export const handlers = [
  // TODO: add concrete handlers when data APIs are defined.
  http.get("/mock-placeholder", () => {
    return new Response(null, { status: 404 });
  }),
];
