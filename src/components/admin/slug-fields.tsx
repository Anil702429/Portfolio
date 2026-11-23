"use client";

import { useState } from "react";
import { TextField } from "@/components/ui/field";
import { slugify } from "@/lib/slug";
import type { ActionState } from "@/types";

/** The slug follows the title until it is edited or already saved. */
export function TitleAndSlug({
  title,
  slug,
  errors,
}: {
  title: string;
  slug: string;
  errors: ActionState["errors"];
}) {
  const [slugValue, setSlugValue] = useState(slug);
  const [linked, setLinked] = useState(!slug);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <TextField
        label="Title"
        name="title"
        required
        maxLength={160}
        defaultValue={title}
        errors={errors?.title}
        onChange={(event) => linked && setSlugValue(slugify(event.target.value))}
      />
      <TextField
        label="Slug"
        name="slug"
        required
        maxLength={80}
        value={slugValue}
        hint="The last part of the page address."
        errors={errors?.slug}
        onChange={(event) => {
          setLinked(false);
          setSlugValue(event.target.value);
        }}
      />
    </div>
  );
}
