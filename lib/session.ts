import { supabase } from "./supabase";

// Single-device login support.
// On login we generate a random session id, store it locally, and write it to
// the user's profiles.current_session_id. A guard checks that the stored id
// still matches; if another device logs in, the id changes and we log out.

const SESSION_ID_KEY = "bubbry_shop_device_session_id";
const UID_KEY = "bubbry_shop_uid";

export function getDeviceSessionId(): string | null {
  try { return localStorage.getItem(SESSION_ID_KEY); } catch { return null; }
}

function makeId(): string {
  return (
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  );
}

// Call right after a successful login (we have the user id).
export async function setCurrentSession(userId: string): Promise<void> {
  const sid = makeId();
  try { localStorage.setItem(SESSION_ID_KEY, sid); } catch {}
  try {
    await supabase.from("profiles").update({ current_session_id: sid }).eq("id", userId);
  } catch {}
}

// Returns true if this device is still the active session for the user.
export async function isSessionCurrent(userId: string): Promise<boolean> {
  const mine = getDeviceSessionId();
  if (!mine) return true; // no local id yet (older login) — don't kick out
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("current_session_id")
      .eq("id", userId)
      .single();
    if (error || !data) return true; // be lenient on errors — never lock out wrongly
    if (!data.current_session_id) return true;
    return data.current_session_id === mine;
  } catch {
    return true;
  }
}

export function getLoggedInUid(): string | null {
  try { return localStorage.getItem(UID_KEY); } catch { return null; }
}
