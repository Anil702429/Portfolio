"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { UploadInput } from "@/components/admin/media-field";

// Only loaded when a preview is opened.
const Markdown = dynamic(() => import("@/components/markdown").then((module) => module.Markdown), {
  loading: () => <p className="text-soft">Loading preview…</p>,
});

const tools = [
  { label: "Heading", before: "## ", after: "", sample: "Heading" },
  { label: "Bold", before: "**", after: "**", sample: "bold" },
  { label: "Link", before: "[", after: "](https://)", sample: "link text" },
  { label: "List", before: "- ", after: "", sample: "item" },
  { label: "Code", before: "```python\n", after: "\n```", sample: "print('hello')" },
];

export function MarkdownEditor({
  name,
  label,
  bucket,
  defaultValue,
  errors,
  rows = 18,
}: {
  name: string;
  label: string;
  bucket: "project-images" | "post-covers";
  defaultValue: string;
  errors?: string[];
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);

  function insert(before: string, after: string, sample: string) {
    const element = textarea.current;
    const start = element?.selectionStart ?? value.length;
    const end = element?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || sample;
    setValue((current) => current.slice(0, start) + before + selected + after + current.slice(end));
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  const tool = "min-h-9 rounded-md border border-line px-3 text-sm font-medium hover:bg-tint disabled:opacity-50";
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-medium">
        {label}
      </label>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {tools.map((item) => (
          <button key={item.label} type="button" disabled={preview} className={tool} onClick={() => insert(item.before, item.after, item.sample)}>
            {item.label}
          </button>
        ))}
        <button type="button" aria-pressed={preview} className={`${tool} ml-auto`} onClick={() => setPreview(!preview)}>
          {preview ? "Edit" : "Preview"}
        </button>
      </div>
      <textarea
        ref={textarea}
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-invalid={errors?.length ? true : undefined}
        className={`w-full rounded-md border border-line bg-surface px-3.5 py-2.5 font-mono text-sm leading-relaxed aria-invalid:border-danger ${preview ? "hidden" : ""}`}
      />
      {preview ? (
        <div className="min-h-60 rounded-md border border-line p-5">
          <Markdown>{value || "Nothing written yet."}</Markdown>
        </div>
      ) : (
        <div className="mt-3">
          <UploadInput
            bucket={bucket}
            label="Upload an image into the text"
            onUploaded={(url) => insert("![", `](${url})`, "describe the image")}
          />
        </div>
      )}
      {errors?.length ? <p className="mt-1.5 text-sm font-medium text-danger">{errors.join(" ")}</p> : null}
    </div>
  );
}
