import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteMessage, setMessageRead } from "@/actions/messages";
import { ActionButton } from "@/components/admin/action-button";
import { AdminHeader } from "@/components/admin/admin-header";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/markdown";
import { getPrisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Message" };

export default async function MessagePage({ params }: PageProps<"/admin/messages/[id]">) {
  await requireAdmin();
  const id = idSchema.safeParse((await params).id);
  if (!id.success) notFound();
  const message = await getPrisma().contactMessage.findUnique({ where: { id: id.data }, omit: { ipHash: true } });
  if (!message) notFound();
  const unread = message.status === "UNREAD";
  return (
    <>
      <AdminHeader title={message.subject} />
      <p className="text-soft">
        From <strong className="text-text">{message.name}</strong> ({message.email}), {formatDate(message.createdAt)}.{" "}
        {unread ? "Unread." : "Read."}
      </p>
      <p className="my-8 max-w-2xl border-y border-line py-8 text-lg leading-relaxed break-words whitespace-pre-wrap">
        {message.message}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink
          href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
          className="min-h-10 px-3.5 text-sm"
        >
          Reply by email
        </ButtonLink>
        <ActionButton action={setMessageRead.bind(null, message.id, unread)}>
          {unread ? "Mark as read" : "Mark as unread"}
        </ActionButton>
        <ActionButton
          variant="danger"
          action={deleteMessage.bind(null, message.id)}
          confirm={`Delete the message from ${message.name}? This can't be undone.`}
        >
          Delete
        </ActionButton>
        <Link href="/admin/messages" className="underline underline-offset-4">
          All messages
        </Link>
      </div>
    </>
  );
}
