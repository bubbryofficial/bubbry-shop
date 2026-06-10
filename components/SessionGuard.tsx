"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getDeviceSessionId, getLoggedInUid } from "../lib/session";

// Watches the logged-in user's current_session_id. If another device logs in
// (changing that id), this device logs itself out and goes to /login.
export default function SessionGuard() {
  useEffect(() => {
    let channel: any = null;
    let poll: any = null;
    let cancelled = false;

    function logoutToLogin() {
      try { localStorage.removeItem("bubbry_shop_uid"); } catch {}
      try { localStorage.removeItem("bubbry_shop_device_session_id"); } catch {}
      try { supabase.auth.signOut(); } catch {}
      const p = window.location.pathname;
      if (p !== "/login" && p !== "/signup" && p !== "/") {
        window.location.href = "/login";
      }
    }

    async function check() {
      const uid = getLoggedInUid();
      const mine = getDeviceSessionId();
      if (!uid || !mine) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("current_session_id")
          .eq("id", uid)
          .single();
        if (error || !data) return;
        if (data.current_session_id && data.current_session_id !== mine) {
          if (!cancelled) logoutToLogin();
        }
      } catch {}
    }

    const uid = getLoggedInUid();
    if (uid && getDeviceSessionId()) {
      channel = supabase
        .channel("session-guard-" + uid)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles", filter: "id=eq." + uid },
          (payload: any) => {
            const newId = payload?.new?.current_session_id;
            const mine = getDeviceSessionId();
            if (newId && mine && newId !== mine) logoutToLogin();
          }
        )
        .subscribe();

      poll = setInterval(check, 10000);
      check();
    }

    return () => {
      cancelled = true;
      if (channel) { try { supabase.removeChannel(channel); } catch {} }
      if (poll) clearInterval(poll);
    };
  }, []);

  return null;
}
