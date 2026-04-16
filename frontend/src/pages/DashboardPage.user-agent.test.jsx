import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DashboardPage from "@/pages/DashboardPage.jsx";
import { apiFetch } from "@/lib/api.js";

vi.mock("@/lib/api.js", () => ({
  apiFetch: vi.fn()
}));

const templates = {
  builtin: [{ id: "meta-default", name: "默认模板", target: "meta", builtin: true }],
  custom: []
};

describe("DashboardPage User-Agent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiFetch.mockResolvedValue({ links: [] });
  });

  it("默认留空并显示可选 placeholder", async () => {
    render(<DashboardPage templates={templates} />);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    const input = screen.getByPlaceholderText("获取远程订阅时携带的 User-Agent 标识（可选）");
    expect(input).toHaveValue("");
  });
});
