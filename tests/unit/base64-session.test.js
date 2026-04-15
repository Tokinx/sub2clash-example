import { describe, expect, it } from "vitest";

import { decodeBase64UrlText, encodeBase64UrlText } from "../../src/utils/base64url.js";
import { createSessionToken, verifySessionToken } from "../../src/auth/session.js";
import { createEnv } from "../helpers/env.js";

describe("base64url", () => {
  it("可以稳定编码与解码 Unicode 文本", () => {
    const source = "香港节点 / OpenAI / 测试";
    const encoded = encodeBase64UrlText(source);
    expect(decodeBase64UrlText(encoded)).toBe(source);
  });
});

describe("session", () => {
  it("可以生成并验证会话 token", async () => {
    const env = createEnv();
    const token = await createSessionToken(env);
    const payload = await verifySessionToken(token, env);
    expect(payload.v).toBe(1);
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });
});
