import { useState } from "react";

import { apiFetch } from "../lib/api.js";

export default function LoginPage({ onAuthenticated }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password })
      });
      onAuthenticated();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] px-5 py-8 text-[var(--ink)]">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-10">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--paper-soft)] p-8 shadow-[0_24px_70px_rgba(20,20,19,0.06)] md:p-12">
          <p className="mb-3 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--stone)]">
            Private Console
          </p>
          <h1 className="font-display text-[3rem] leading-[0.96] md:text-[4.7rem]">
            把订阅管理
            <br />
            收回到自己手里
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)]">
            这是一个只服务于你自己的订阅聚合与模板控制台。所有模板、规则和短链，都只在这张暖色纸页里整理，不再暴露给公共服务。
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["聚合订阅", "将多个订阅和单节点折叠成一份输出。"],
              ["模板管理", "内置与自建模板统一维护。"],
              ["私有门禁", "登录后才可进入管理界面和 API。"]
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <h2 className="font-display text-xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--dark-border)] bg-[var(--dark)] p-8 text-[var(--ivory)] shadow-[0_24px_70px_rgba(20,20,19,0.18)] md:p-10">
          <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--silver)]">
            Access
          </p>
          <h2 className="font-display text-[2.2rem] leading-[1.05]">输入全局密码</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--silver)]">
            密码来源于 Workers Secret。浏览器不会保存明文，登录成功后仅保留签名会话。
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            <label className="field">
              <span className="field-label text-[var(--silver)]">管理密码</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-input border-[var(--dark-border)] bg-[rgba(250,249,245,0.06)] text-[var(--ivory)] placeholder:text-[rgba(250,249,245,0.4)]"
                placeholder="输入 Worker Secret 对应的密码"
              />
            </label>
            {error ? <p className="text-sm text-[#ffb7a2]">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-[var(--ivory)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "验证中..." : "进入管理台"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
