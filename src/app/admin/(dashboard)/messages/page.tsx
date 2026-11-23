import type { Metadata } from "next";
import Link from "next/link";
import { deleteMessage, setMessageRead } from "@/actions/messages";
import { ActionButton } from "@/components/admin/action-button";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/markdown";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Messages" };

const PAGE_SIZE = 50;

export default async function AdminMessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdmin();
  const page = Math.min(10_000, Math.max(1, Math.floor(Number((await searchParams).page)) || 1));
  const rows = await getPrisma().contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE + 1,
    select: { id: true, name: true, subject: true, status: true, createdAt: true },
  });
  const messages = rows.slice(0, PAGE_SIZE);
  return (
    <>
      <AdminHeader title="Messages" />
      {messages.length === 0 ? <p className="text-soft">Messages from the contact form appear here.</p> : null}
      <ul>
        {messages.map((message) => {
          const unread = message.status === "UNREAD";
          return (
            <li key={message.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-4">
              <div className="min-w-48 flex-1">
                <Link href={`/admin/messages/${message.id}`} className={`text-lg underline-offset-4 hover:underline ${unread ? "font-bold" : ""}`}>
                  {message.subject}
                </Link>
                <p className="text-sm text-soft">
                  {unread ? "Unread, from " : "From "}
                  {message.name}, {formatDate(message.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
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
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex gap-6">
        {page > 1 ? (
          <Link href={`/admin/messages?page=${page - 1}`} className="underline underline-offset-4">
            Newer
          </Link>
        ) : null}
        {rows.length > PAGE_SIZE ? (
          <Link href={`/admin/messages?page=${page + 1}`} className="underline underline-offset-4">
            Older
          </Link>
        ) : null}
      </div>
    </>
  );
}
