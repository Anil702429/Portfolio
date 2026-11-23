import "server-only";
import { Prisma } from "@/generated/prisma/client";
import type { ActionState } from "@/types";

export const invalid = (errors: ActionState["errors"]): ActionState => ({
  ok: false,
  message: "Check the highlighted fields.",
  errors,
});

export const isNotFound = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

/** Turns a database failure into a message that reveals nothing internal. */
export function databaseError(error: unknown): ActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return invalid({ slug: ["Another entry already uses this slug."] });
    }
    if (error.code === "P2025") {
      return { ok: false, message: "This entry no longer exists." };
    }
  }
  console.error("Database error:", error instanceof Error ? error.message : error);
  return { ok: false, message: "The change wasn't saved because the database didn't respond. Try again." };
}
