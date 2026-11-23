import { z } from "zod";
import { slugify } from "@/lib/slug";

/** Text with line endings normalised. HTML is never rendered, so no stripping is needed. */
const text = (max: number) =>
  z
    .string()
    .max(max, `Use ${max} characters or fewer.`)
    .transform((value) => value.replace(/\r\n/g, "\n").trim());
const required = (max: number, label: string) =>
  text(max).pipe(z.string().min(1, `Enter ${label}.`));
const singleLine = (max: number, label: string) =>
  required(max, label).refine((value) => !/[\r\n]/.test(value), "Use a single line.");

const isHttpUrl = (value: string) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};
const webUrl = z.string().trim().max(500).refine(isHttpUrl, "Enter a full URL starting with https://.");
const optionalUrl = z.union([z.literal("").transform(() => null), webUrl]);

/** Media must be a bundled file or a public file in this project's Supabase Storage. */
export function isAllowedMedia(value: string): boolean {
  if (/^\/images\/[\w./-]+$/.test(value)) return !value.includes("..");
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  try {
    const url = new URL(value);
    return (
      url.origin === new URL(base).origin && url.pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
const mediaUrl = z.string().trim().max(500).refine(isAllowedMedia, "Upload a file instead.");
const optionalMedia = z.union([z.literal("").transform(() => null), mediaUrl]);

const checkbox = z.preprocess((value) => value === "on", z.boolean());
const slug = z
  .string()
  .trim()
  .max(80)
  .transform(slugify)
  .pipe(z.string().min(1, "Enter a slug."));

const commaList = (maxItems: number) =>
  z
    .string()
    .max(1000)
    .transform((value) => {
      const unique = new Map<string, string>();
      for (const item of value.split(",").map((part) => part.trim()).filter(Boolean)) {
        const key = slugify(item);
        if (key && !unique.has(key)) unique.set(key, item);
      }
      return [...unique].map(([itemSlug, name]) => ({ name, slug: itemSlug }));
    })
    .refine((items) => items.length <= maxItems, `Use ${maxItems} or fewer.`)
    .refine((items) => items.every((item) => item.name.length <= 40), "Keep each under 40 characters.");

const lineList = (max: number) =>
  text(max).transform((value) =>
    value.split("\n").map((line) => line.trim()).filter(Boolean),
  );

export const idSchema = z.uuid();

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(200),
});

export const contactSchema = z.object({
  name: singleLine(100, "your name"),
  email: z.string().trim().max(254).pipe(z.email("Enter a valid email address.")),
  subject: singleLine(150, "a subject"),
  message: text(5000).pipe(z.string().min(10, "Write at least 10 characters.")),
});

export const projectSchema = z.object({
  title: singleLine(120, "a title"),
  slug,
  category: text(80),
  shortDescription: required(240, "a short description"),
  description: required(3000, "an overview"),
  problem: text(3000),
  solution: text(3000),
  features: lineList(4000),
  content: text(50_000),
  coverImage: optionalMedia,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  technologies: commaList(20),
  displayOrder: z.coerce.number().int("Use a whole number.").min(0).max(9999),
  featured: checkbox,
  published: checkbox,
  images: z.preprocess(
    (value) => {
      try {
        return JSON.parse(String(value || "[]"));
      } catch {
        return null;
      }
    },
    z.array(z.object({ url: mediaUrl, alt: text(200) })).max(12, "Use 12 screenshots or fewer."),
  ),
});

export const postSchema = z
  .object({
    title: singleLine(160, "a title"),
    slug,
    excerpt: required(300, "an excerpt"),
    content: text(100_000),
    coverImage: optionalMedia,
    category: text(60),
    tags: commaList(12),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    publishedAt: z.union([
      z.literal("").transform(() => null),
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Enter a date and time.")
        .transform((value) => new Date(`${value}:00Z`))
        .refine((date) => !Number.isNaN(date.getTime()), "Enter a valid date."),
    ]),
  })
  .refine((post) => post.status === "DRAFT" || post.content.length > 0, {
    path: ["content"],
    message: "Write the article before publishing it.",
  });

export const settingsSchema = z.object({
  name: singleLine(80, "your name"),
  professionalTitle: singleLine(120, "a professional title"),
  introduction: required(500, "an introduction"),
  about: text(6000),
  location: text(80),
  availability: text(160),
  profileImage: optionalMedia,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  email: z.union([z.literal("").transform(() => null), z.email("Enter a valid email address.")]),
  resumeUrl: z.union([z.literal("").transform(() => null), mediaUrl, webUrl]),
  heroSnippet: text(3000),
  heroSnippetLabel: text(120),
  heroSnippetUrl: optionalUrl,
  socialLinks: lineList(3000)
    .transform((lines) =>
      lines.map((line) => {
        const [label = "", ...rest] = line.split("|");
        return { label: label.trim(), url: rest.join("|").trim() };
      }),
    )
    .refine(
      (links) => links.every((link) => link.label && isHttpUrl(link.url)),
      "Write one per line, as: Label | https://…",
    )
    .refine((links) => new Set(links.map((l) => l.label)).size === links.length, "Labels must be unique."),
  skillGroups: lineList(4000)
    .transform((lines) =>
      lines.map((line) => {
        const at = line.indexOf(":");
        return {
          name: line.slice(0, Math.max(at, 0)).trim(),
          skills: line.slice(at + 1).split(",").map((skill) => skill.trim()).filter(Boolean),
        };
      }),
    )
    .refine(
      (groups) => groups.every((group) => group.name && group.skills.length > 0),
      "Write one group per line, as: Backend: Python, Django",
    )
    .refine((groups) => new Set(groups.map((g) => g.name)).size === groups.length, "Group names must be unique."),
  education: lineList(3000).transform((lines) =>
    lines.map((line) => {
      const [title = "", institution = "", period = ""] = line.split("|").map((part) => part.trim());
      return { title, institution, period };
    }),
  ),
});

export function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}
