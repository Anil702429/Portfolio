import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";

/** Supabase client acting as the signed-in visitor. Never uses the service role. */
export async function createSupabaseServerClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try {
          for (const { name, value, options } of items) {
            cookieStore.set(name, value, { ...options, httpOnly: true, secure: process.env.NODE_ENV === "production" });
          }
        } catch {
          // Server Components cannot set cookies; src/proxy.ts refreshes sessions.
        }
      },
    },
  });
}
