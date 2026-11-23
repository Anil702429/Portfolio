"use server";

import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BUCKETS, detectType, isBucket, MAX_UPLOAD_BYTES } from "@/lib/supabase/storage";

export type UploadResult = { ok: true; url: string } | { ok: false; message: string };

/** Uploads as the signed-in admin, so Storage RLS is enforced as well. */
export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const bucket = formData.get("bucket");
  const file = formData.get("file");
  if (!isBucket(bucket) || !(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a file to upload." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "Choose a file under 4 MB." };
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectType(bytes);
  const allowed: readonly string[] = BUCKETS[bucket];
  if (!type || !allowed.includes(type.mime)) {
    return {
      ok: false,
      message: bucket === "resume" ? "Choose a PDF file." : "Choose a JPEG, PNG, WebP or AVIF image.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Supabase Storage is not configured." };
  const path = `${randomUUID()}.${type.extension}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, bytes, { contentType: type.mime, cacheControl: "31536000" });
  if (error) {
    console.error("Upload failed:", error.message);
    return { ok: false, message: "The upload failed. Check the Storage buckets and policies, then try again." };
  }
  return { ok: true, url: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl };
}
