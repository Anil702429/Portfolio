import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ButtonLink } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/markdown";
import { getPrisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();
  const prisma = getPrisma();
  const [projects, publishedProjects, posts, publishedPosts, unread, recent] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const summary = [
    { label: "Projects", value: `${publishedProjects} published, ${projects - publishedProjects} hidden`, href: "/admin/projects" },
    { label: "Articles", value: `${publishedPosts} published, ${posts - publishedPosts} drafts`, href: "/admin/posts" },
    { label: "Messages", value: `${unread} unread`, href: "/admin/messages" },
  ];
  return (
    <>
      <AdminHeader title="Overview">
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/admin/projects/new">New project</ButtonLink>
          <ButtonLink href="/admin/posts/new" variant="outline">
            New article
          </ButtonLink>
        </div>
      </AdminHeader>
      <dl>
        {summary.map((item) => (
          <div key={item.label} className="grid grid-cols-[8rem_1fr] border-t border-line py-4">
            <dt className="font-bold">
              <Link href={item.href} className="underline underline-offset-4">
                {item.label}
              </Link>
            </dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-12 mb-4 text-xl font-bold">Recent messages</h2>
      {recent.length ? (
        <ul>
          {recent.map((message) => (
            <li key={message.id} className="border-t border-line py-3">
              <Link href={`/admin/messages/${message.id}`} className={`underline-offset-4 hover:underline ${message.status === "UNREAD" ? "font-bold" : ""}`}>
                {message.subject}
              </Link>
              <p className="text-sm text-soft">
                {message.name}, {formatDate(message.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-soft">Messages from the contact form appear here.</p>
      )}
    </>
  );
}
