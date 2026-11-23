import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isAdminConfigured } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Admin = { userId: string; email: string };

/**
 * The signed-in administrator, or null. getUser() verifies the session with the
 * Supabase Auth server, then the account must be on the AdminUser allow-list.
 */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  if (!isAdminConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return getPrisma().adminUser.findUnique({
    where: { userId: data.user.id },
    select: { userId: true, email: true },
  });
});

/** Call at the top of every admin page and every admin Server Action. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
