"use server";

import { redirect } from "next/navigation";
import { isAdminConfigured } from "@/lib/env";
import { invalid } from "@/lib/errors";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fieldErrors, loginSchema } from "@/lib/validation";
import type { ActionState } from "@/types";

export async function signIn(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (!isAdminConfigured()) {
    return { ok: false, message: "Sign-in needs the database and Supabase settings. See the README." };
  }
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(fieldErrors(parsed.error));

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Sign-in is not configured." };
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  // One message for every refusal, so accounts cannot be discovered.
  const refused = { ok: false, message: "That email and password don't match an administrator." };
  if (error || !data.user) return refused;

  let isAdmin = false;
  try {
    isAdmin = (await getPrisma().adminUser.count({ where: { userId: data.user.id } })) === 1;
  } catch (cause) {
    console.error("Admin lookup failed:", cause instanceof Error ? cause.message : cause);
  }
  if (!isAdmin) {
    await supabase.auth.signOut({ scope: "local" });
    return refused;
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut({ scope: "local" });
  redirect("/admin/login");
}
