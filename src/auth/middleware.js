import { createMiddleware } from "hono/factory";

import { unauthorized } from "../utils/errors.js";
import { getSessionFromRequest } from "./session.js";

export const requireSession = createMiddleware(async (c, next) => {
  const session = await getSessionFromRequest(c.req.raw, c.env);
  if (!session) {
    throw unauthorized();
  }
  c.set("session", session);
  await next();
});
