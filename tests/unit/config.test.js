import { describe, expect, it } from "vitest";

import { validateAndNormalizeConfig } from "../../src/domain/config.js";

describe("validateAndNormalizeConfig", () => {
  it("默认不注入 User-Agent", () => {
    const config = validateAndNormalizeConfig({
      target: "meta",
      sources: {
        subscriptions: [{ url: "https://example.com/sub" }],
        nodes: []
      },
      template: {
        mode: "builtin",
        value: "meta-default"
      },
      routing: {
        ruleProviders: [],
        rules: []
      },
      transforms: {
        filterRegex: "",
        replacements: []
      },
      options: {}
    });

    expect(config.options.userAgent).toBe("");
  });
});
