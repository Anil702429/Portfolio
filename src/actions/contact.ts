"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { sendContactNotification } from "@/lib/email";
import { isDatabaseConfigured } from "@/lib/env";
import { invalid } from "@/lib/errors";
import { getPrisma } from "@/lib/prisma";
import { contactSchema, fieldErrors } from "@/lib/validation";
import type { ActionState } from "@/types";

const HOUR = 60 * 60 * 1000;
const PER_SENDER_PER_HOUR = 3;
const TOTAL_PER_HOUR = 60;
const MIN_FILL_MS = 2500;

const SENT: ActionState = { ok: true, message: "Message sent. Thank you, I'll reply by email." };

export async function sendMessage(_state: ActionState, formData: FormData): Promise<ActionState> {
  const salt = process.env.CONTACT_IP_SALT;
  if (!isDatabaseConfigured() || !salt) {
    return { ok: false, message: "The contact form isn't connected yet. Please email me instead." };
  }

  // Bots fill the hidden field or submit instantly. They get the success message.
  const startedAt = Number(formData.get("startedAt"));
  const tooFast = !Number.isFinite(startedAt) || startedAt <= 0 || Date.now() - startedAt < MIN_FILL_MS;
  if (formData.get("website") || tooFast) return SENT;

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(fieldErrors(parsed.error));

  const requestHeaders = await headers();
  // Set by the hosting platform; x-real-ip cannot be extended by the client on Vercel.
  const ip =
    requestHeaders.get("x-real-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const ipHash = createHmac("sha256", salt).update(ip).digest("hex");

  try {
    const prisma = getPrisma();
    const since = { gte: new Date(Date.now() - HOUR) };
    const [fromSender, total] = await Promise.all([
      prisma.contactMessage.count({
        where: { createdAt: since, OR: [{ ipHash }, { email: parsed.data.email }] },
      }),
      prisma.contactMessage.count({ where: { createdAt: since } }),
    ]);
    if (fromSender >= PER_SENDER_PER_HOUR || total >= TOTAL_PER_HOUR) {
      return { ok: false, message: "Too many messages were sent recently. Try again in an hour, or email me." };
    }
    await prisma.contactMessage.create({ data: { ...parsed.data, ipHash } });
  } catch (error) {
    console.error("Contact message not saved:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Your message wasn't sent. Try again, or email me instead." };
  }

  after(() => sendContactNotification(parsed.data));
  return SENT;
}
