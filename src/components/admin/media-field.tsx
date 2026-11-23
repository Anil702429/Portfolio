"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { uploadMedia } from "@/actions/media";
import { Button } from "@/components/ui/button";

type Bucket = "project-images" | "post-covers" | "profile" | "resume";

/** File input that uploads immediately and hands back the public URL. */
export function UploadInput({
  bucket,
  label,
  onUploaded,
}: {
  bucket: Bucket;
  label: string;
  onUploaded: (url: string) => void;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 4 * 1024 * 1024) {
      setError("Choose a file under 4 MB.");
      input.value = "";
      return;
    }
    setBusy(true);
    try {
      const data = new FormData();
      data.set("bucket", bucket);
      data.set("file", file);
      const result = await uploadMedia(data);
      if (result.ok) onUploaded(result.url);
      else setError(result.message);
    } catch {
      setError("The upload failed. Try again.");
    }
    setBusy(false);
    input.value = "";
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-soft">
        {busy ? "Uploading…" : label}
      </label>
      <input
        id={id}
        type="file"
        disabled={busy}
        accept={bucket === "resume" ? "application/pdf" : "image/jpeg,image/png,image/webp,image/avif"}
        onChange={(event) => void upload(event.currentTarget)}
        className="block w-full text-sm file:mr-3 file:min-h-10 file:rounded-md file:border file:border-line file:bg-surface file:px-3.5 file:font-semibold"
      />
      {error ? (
        <p role="alert" className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function MediaField({
  name,
  label,
  bucket,
  defaultValue,
  errors,
  allowUrl = false,
}: {
  name: string;
  label: string;
  bucket: Bucket;
  defaultValue: string | null;
  errors?: string[];
  /** Also accept a link to a file hosted elsewhere. */
  allowUrl?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  return (
    <fieldset className="rounded-md border border-line p-4">
      <legend className="px-1 font-medium">{label}</legend>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {bucket === "resume" ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-accent underline underline-offset-4">
              {url}
            </a>
          ) : (
            <Image src={url} alt="" width={192} height={120} className="h-30 w-48 rounded-md border border-line object-cover object-top" />
          )}
          <Button type="button" variant="danger" className="min-h-10 px-3.5 text-sm" onClick={() => setUrl("")}>
            Remove
          </Button>
        </div>
      ) : null}
      <UploadInput
        bucket={bucket}
        label={bucket === "resume" ? "PDF, up to 4 MB" : "JPEG, PNG, WebP or AVIF, up to 4 MB"}
        onUploaded={setUrl}
      />
      {allowUrl ? (
        <label className="mt-4 block text-sm text-soft">
          Or paste a link
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="mt-1.5 block min-h-10 w-full rounded-md border border-line bg-surface px-3 text-text"
          />
        </label>
      ) : null}
      {errors?.length ? <p className="mt-1.5 text-sm font-medium text-danger">{errors.join(" ")}</p> : null}
    </fieldset>
  );
}
