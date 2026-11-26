import { createClient } from "@supabase/supabase-js";

// Returns null when the database is not configured, so the app still works offline.
export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.startsWith("paste_") || key.startsWith("paste_")) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
