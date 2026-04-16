import { Hono } from "hono";

import { AppError } from "./utils/errors.js";
import { decodeBase64UrlText } from "./utils/base64url.js";
import { createApiRouter } from "./routes/api.js";
import { renderConfig, renderLink } from "./domain/render.js";

const app = new Hono();

app.onError((error, c) => {
  if (error instanceof AppError) {
    return c.json(
      {
        error: error.message,
        details: error.details
      },
      error.status
    );
  }

  console.error(error);
  return c.json(
    {
      error: "服务内部错误"
    },
    500
  );
});

app.get("/sub/:payload", async (c) => {
  const payload = c.req.param("payload");
  const config = JSON.parse(decodeBase64UrlText(payload));
  const result = await renderConfig(c.env, c.req.raw, config);
  if (result.subscriptionUserinfo) {
    c.header("subscription-userinfo", result.subscriptionUserinfo);
  }
  c.header("content-type", "text/yaml; charset=utf-8");
  return c.body(result.yaml);
});

app.get("/s/:id", async (c) => {
  const result = await renderLink(c.env, c.req.raw, c.req.param("id"));
  if (result.subscriptionUserinfo) {
    c.header("subscription-userinfo", result.subscriptionUserinfo);
  }
  c.header("content-type", "text/yaml; charset=utf-8");
  return c.body(result.yaml);
});

app.route("/api", createApiRouter());

app.all("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
