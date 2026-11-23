"use client";

import Link from "next/link";
import { savePost } from "@/actions/posts";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { MediaField } from "@/components/admin/media-field";
import { TitleAndSlug } from "@/components/admin/slug-fields";
import { Button } from "@/components/ui/button";
import { SelectField, TextArea, TextField } from "@/components/ui/field";
import { FormStatus } from "@/components/ui/form-status";
import { useFormAction } from "@/components/ui/use-form-action";

export type PostFormValues = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
  /** yyyy-MM-ddTHH:mm in UTC, or empty. */
  publishedAt: string;
};

export function PostForm({ post, categories }: { post: PostFormValues; categories: string[] }) {
  const { state, pending, onSubmit } = useFormAction(savePost.bind(null, post.id));
  const errors = state.errors;
  return (
    <form method="post" onSubmit={onSubmit} className="space-y-6">
      <TitleAndSlug title={post.title} slug={post.slug} errors={errors} />
      <TextArea label="Excerpt" name="excerpt" rows={2} required maxLength={300} defaultValue={post.excerpt} errors={errors?.excerpt} />
      <MarkdownEditor label="Article (Markdown)" name="content" bucket="post-covers" defaultValue={post.content} errors={errors?.content} />
      <MediaField label="Cover image" name="coverImage" bucket="post-covers" defaultValue={post.coverImage} errors={errors?.coverImage} />
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <TextField label="Category" name="category" list="category-options" maxLength={60} defaultValue={post.category} errors={errors?.category} />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
        <TextField label="Tags" name="tags" defaultValue={post.tags.join(", ")} hint="Separate with commas." errors={errors?.tags} />
        <SelectField label="Status" name="status" defaultValue={post.status} errors={errors?.status}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </SelectField>
        <TextField
          label="Publication date (UTC)"
          name="publishedAt"
          type="datetime-local"
          defaultValue={post.publishedAt}
          hint="Leave empty to use the time it is published. A future date schedules it."
          errors={errors?.publishedAt}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save article"}
        </Button>
        <Link href="/admin/posts" className="underline underline-offset-4">
          Cancel
        </Link>
        <FormStatus state={state} />
      </div>
    </form>
  );
}
