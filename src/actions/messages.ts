"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validation";

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await requireAdmin();
  await getPrisma().contactMessage.updateMany({
    where: { id: idSchema.parse(id) },
    data: { status: read === true ? "READ" : "UNREAD" },
  });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  await getPrisma().contactMessage.deleteMany({ where: { id: idSchema.parse(id) } });
  revalidatePath("/admin", "layout");
  redirect("/admin/messages");
}
