import Link from "next/link";
import { signOut } from "@/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Pages check again: layouts are not re-run on every navigation.
  const admin = await requireAdmin();
  const unread = await getPrisma().contactMessage.count({ where: { status: "UNREAD" } });
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <div className="bg-ink text-white lg:min-h-dvh">
        <div className="flex flex-col gap-4 px-5 py-4 lg:sticky lg:top-0 lg:h-dvh lg:py-7">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-lg font-bold">
              Admin
            </Link>
            <ThemeToggle className="-mr-2" />
          </div>
          <AdminNav unread={unread} />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft lg:mt-auto lg:block lg:space-y-3">
            <Link href="/" className="underline underline-offset-4 hover:text-white">
              View site
            </Link>
            <p className="break-all">{admin.email}</p>
            <form action={signOut}>
              <button type="submit" className="underline underline-offset-4 hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      <main className="min-w-0 px-5 py-8 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
