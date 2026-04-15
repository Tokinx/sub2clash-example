import { Link, NavLink, useNavigate } from "react-router-dom";

import { apiFetch } from "../lib/api.js";

export default function Shell({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({})
    });
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,100,66,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,20,19,0.08),transparent_30%)]" />
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(245,244,237,0.88)] backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <Link
            to="/"
            className="font-display text-[1.55rem] tracking-[0.01em]"
          >
            sub2clash
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-[0.72rem] px-4 py-2 transition ${isActive ? "bg-[var(--sand)] text-[var(--ink)] shadow-[0_0_0_1px_var(--ring)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`
              }
            >
              配置器
            </NavLink>
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `rounded-[0.72rem] px-4 py-2 transition ${isActive ? "bg-[var(--sand)] text-[var(--ink)] shadow-[0_0_0_1px_var(--ring)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`
              }
            >
              模板管理
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-[0.72rem] bg-[var(--brand)] px-4 py-2 text-[var(--ivory)] shadow-[0_0_0_1px_rgba(201,100,66,0.35)] transition hover:translate-y-[-1px]"
            >
              退出
            </button>
          </nav>
        </div>
      </header>
      <main className="relative px-4 py-4 md:px-6 md:py-6">
        {children}
      </main>
    </div>
  );
}
