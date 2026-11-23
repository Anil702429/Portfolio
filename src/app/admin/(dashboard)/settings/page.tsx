import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader title="Settings" />
      <SettingsForm settings={await getSettings()} />
    </>
  );
}
