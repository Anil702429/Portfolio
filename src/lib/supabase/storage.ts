import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const BUCKETS = {
  "project-images": IMAGE_TYPES,
  "post-covers": IMAGE_TYPES,
  profile: IMAGE_TYPES,
  resume: ["application/pdf"],
} as const;

export type Bucket = keyof typeof BUCKETS;

export const isBucket = (value: unknown): value is Bucket =>
  typeof value === "string" && Object.hasOwn(BUCKETS, value);

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** The real type of a file from its leading bytes. The browser's claim is not trusted. */
export function detectType(bytes: Uint8Array): { mime: string; extension: string } | null {
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.subarray(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: "image/jpeg", extension: "jpg" };
  }
  if (bytes[0] === 0x89 && ascii(1, 8) === "PNG\r\n\x1a\n") {
    return { mime: "image/png", extension: "png" };
  }
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    return { mime: "image/webp", extension: "webp" };
  }
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) {
    return { mime: "image/avif", extension: "avif" };
  }
  if (ascii(0, 5) === "%PDF-") return { mime: "application/pdf", extension: "pdf" };
  return null;
}

/** Bucket and path when the URL is one of this project's uploads. */
function parseStorageUrl(url: string): { bucket: Bucket; path: string } | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const prefix = `${new URL(base).origin}/storage/v1/object/public/`;
  if (!url.startsWith(prefix)) return null;
  const [bucket, ...rest] = url.slice(prefix.length).split("/");
  const path = rest.join("/");
  return isBucket(bucket) && path ? { bucket, path } : null;
}

/** Removes uploads that are no longer referenced. Callers must have called requireAdmin(). */
export async function removeUploads(urls: (string | null)[]): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  for (const url of urls) {
    const target = url ? parseStorageUrl(url) : null;
    if (!target) continue;
    const { error } = await supabase.storage.from(target.bucket).remove([target.path]);
    // The record is already saved; a leftover file is not worth failing the request.
    if (error) console.error("Could not delete upload:", error.message);
  }
}
