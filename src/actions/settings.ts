"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { databaseError, invalid } from "@/lib/errors";
import { getPrisma } from "@/lib/prisma";
import { removeUploads } from "@/lib/supabase/storage";
import { fieldErrors, settingsSchema } from "@/lib/validation";
import type { ActionState } from "@/types";

export async function saveSettings(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(fieldErrors(parsed.error));

  const { socialLinks, skillGroups, education, ...settings } = parsed.data;
  const ordered = <T extends object>(rows: T[]) =>
    rows.map((row, displayOrder) => ({ ...row, displayOrder }));
  let replaced: (string | null)[] = [];

  try {
    const prisma = getPrisma();
    const before = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      select: { profileImage: true, resumeUrl: true },
    });
    await prisma.$transaction([
      prisma.siteSettings.upsert({
        where: { id: 1 },
        update: settings,
        create: { id: 1, ...settings },
      }),
      prisma.socialLink.deleteMany(),
      prisma.socialLink.createMany({ data: ordered(socialLinks) }),
      prisma.skillGroup.deleteMany(),
      prisma.skillGroup.createMany({ data: ordered(skillGroups) }),
      prisma.education.deleteMany(),
      prisma.education.createMany({ data: ordered(education) }),
    ]);
    replaced = [
      before?.profileImage === settings.profileImage ? null : (before?.profileImage ?? null),
      before?.resumeUrl === settings.resumeUrl ? null : (before?.resumeUrl ?? null),
    ];
  } catch (error) {
    return databaseError(error);
  }

  await removeUploads(replaced);
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
