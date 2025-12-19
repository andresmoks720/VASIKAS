import { setupServer } from "msw/node";

import { handlers } from "./handlers";
export { resetMockHandlers } from "./handlers";

export const server = setupServer(...handlers);
