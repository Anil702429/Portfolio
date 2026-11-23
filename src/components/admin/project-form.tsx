"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { saveProject } from "@/actions/projects";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { MediaField, UploadInput } from "@/components/admin/media-field";
import { TitleAndSlug } from "@/components/admin/slug-fields";
import { Button } from "@/components/ui/button";
import { Checkbox, TextArea, TextField } from "@/components/ui/field";
import { FormStatus } from "@/components/ui/form-status";
import { useFormAction } from "@/components/ui/use-form-action";

export type ProjectFormValues = {
  id: string | null;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  content: string;
  coverImage: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  technologies: string[];
  images: { url: string; alt: string }[];
  displayOrder: number;
  featured: boolean;
  published: boolean;
};

export function ProjectForm({ project }: { project: ProjectFormValues }) {
  const { state, pending, onSubmit } = useFormAction(saveProject.bind(null, project.id));
  const [images, setImages] = useState(project.images);
  const errors = state.errors;

  return (
    <form method="post" onSubmit={onSubmit} className="space-y-6">
      <TitleAndSlug title={project.title} slug={project.slug} errors={errors} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Category" name="category" maxLength={80} defaultValue={project.category} errors={errors?.category} />
        <TextField
          label="Technologies"
          name="technologies"
          defaultValue={project.technologies.join(", ")}
          hint="Separate with commas."
          errors={errors?.technologies}
        />
      </div>
      <TextArea label="Short description" name="shortDescription" rows={2} required maxLength={240} defaultValue={project.shortDescription} errors={errors?.shortDescription} />
      <TextArea label="Overview" name="description" required maxLength={3000} defaultValue={project.description} errors={errors?.description} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextArea label="Problem" name="problem" maxLength={3000} defaultValue={project.problem} errors={errors?.problem} />
        <TextArea label="Solution" name="solution" maxLength={3000} defaultValue={project.solution} errors={errors?.solution} />
      </div>
      <TextArea label="Main features" name="features" rows={5} defaultValue={project.features.join("\n")} hint="One per line." errors={errors?.features} />
      <MarkdownEditor label="Architecture and implementation (Markdown)" name="content" bucket="project-images" rows={12} defaultValue={project.content} errors={errors?.content} />
      <MediaField label="Cover image" name="coverImage" bucket="project-images" defaultValue={project.coverImage} errors={errors?.coverImage} />

      <fieldset className="rounded-md border border-line p-4">
        <legend className="px-1 font-medium">Screenshots</legend>
        <input type="hidden" name="images" value={JSON.stringify(images)} />
        <ul className="space-y-4">
          {images.map((image, index) => (
            <li key={image.url} className="flex flex-wrap items-center gap-4">
              <Image src={image.url} alt="" width={128} height={80} className="h-20 w-32 rounded-md border border-line object-cover" />
              <input
                aria-label={`Description of screenshot ${index + 1}`}
                placeholder="Describe the screenshot"
                value={image.alt}
                maxLength={200}
                onChange={(event) =>
                  setImages(images.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)))
                }
                className="min-h-10 min-w-48 flex-1 rounded-md border border-line bg-surface px-3"
              />
              <Button
                type="button"
                variant="danger"
                className="min-h-10 px-3.5 text-sm"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className={images.length ? "mt-4" : ""}>
          <UploadInput
            bucket="project-images"
            label="Add a screenshot, up to 4 MB"
            onUploaded={(url) => setImages((current) => [...current, { url, alt: "" }])}
          />
        </div>
        {errors?.images?.length ? <p className="mt-1.5 text-sm text-danger">{errors.images.join(" ")}</p> : null}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="GitHub URL" name="githubUrl" type="url" defaultValue={project.githubUrl ?? ""} errors={errors?.githubUrl} />
        <TextField label="Live demo URL" name="liveUrl" type="url" defaultValue={project.liveUrl ?? ""} errors={errors?.liveUrl} />
      </div>
      <div className="grid items-end gap-6 sm:grid-cols-3">
        <TextField label="Display order" name="displayOrder" type="number" min={0} max={9999} required defaultValue={project.displayOrder} hint="Lower numbers come first." errors={errors?.displayOrder} />
        <Checkbox label="Featured on the home page" name="featured" defaultChecked={project.featured} />
        <Checkbox label="Published" name="published" defaultChecked={project.published} />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save project"}
        </Button>
        <Link href="/admin/projects" className="underline underline-offset-4">
          Cancel
        </Link>
        <FormStatus state={state} />
      </div>
    </form>
  );
}
