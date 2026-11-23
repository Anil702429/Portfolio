import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";
import { isAdminConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-5 py-12">
      <div className="w-full max-w-md rounded-md bg-page p-7 sm:p-9">
        <h1 className="text-3xl font-bold">Sign in</h1>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-soft">
            Set the database and Supabase values in your .env file, then restart the server. The README lists each step.
          </p>
        )}
      </div>
    </main>
  );
}
