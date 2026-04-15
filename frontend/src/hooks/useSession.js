import { useEffect, useState } from "react";

import { apiFetch } from "../lib/api.js";

export function useSession() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/session", {
        headers: {}
      });
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    authenticated,
    loading,
    refresh,
    setAuthenticated
  };
}
