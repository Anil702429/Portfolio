import "server-only";
import { cache } from "react";
import {
  defaultEducation,
  defaultProjects,
  defaultSettings,
  defaultSkillGroups,
  defaultSocialLinks,
} from "@/content/defaults";
import type { Prisma } from "@/generated/prisma/client";
import { isDatabaseConfigured } from "@/lib/env";
import { readingMinutes } from "@/lib/markdown";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { PostDetail, PostSummary, ProjectDetail, ProjectSummary, SiteSettings } from "@/types";

/*
 * Public reads. Every query here is limited to published content. When no
 * database is configured they return the verified content in src/content, so
 * the design can be reviewed locally. Database failures are not masked: they
 * reach the error boundary.
 */

const listOrder = [{ displayOrder: "asc" as const }];

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const fallback: SiteSettings = {
    ...defaultSettings,
    socialLinks: defaultSocialLinks,
    skillGroups: defaultSkillGroups,
    education: defaultEducation,
  };
  if (!isDatabaseConfigured()) return fallback;

  const prisma = getPrisma();
  const [settings, socialLinks, skillGroups, education] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 }, omit: { id: true, updatedAt: true } }),
    prisma.socialLink.findMany({ orderBy: listOrder, select: { label: true, url: true } }),
    prisma.skillGroup.findMany({ orderBy: listOrder, select: { name: true, skills: true } }),
    prisma.education.findMany({
      orderBy: listOrder,
      select: { title: true, institution: true, period: true },
    }),
  ]);
  if (!settings) return fallback;
  return { ...settings, socialLinks, skillGroups, education };
});

const projectSummarySelect = {
  title: true,
  slug: true,
  category: true,
  shortDescription: true,
  coverImage: true,
  githubUrl: true,
  liveUrl: true,
  featured: true,
  updatedAt: true,
  technologies: { select: { name: true, slug: true }, orderBy: { name: "asc" } },
} satisfies Prisma.ProjectSelect;

function previewProjects(): ProjectDetail[] {
  return defaultProjects.map((project) => ({
    ...project,
    technologies: project.technologies.map((name) => ({ name, slug: slugify(name) })),
    images: [],
    updatedAt: null,
  }));
}

export const getProjects = cache(async (): Promise<ProjectSummary[]> => {
  if (!isDatabaseConfigured()) return previewProjects();
  return getPrisma().project.findMany({
    where: { published: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: projectSummarySelect,
  });
});

export const getProject = cache(async (slug: string): Promise<ProjectDetail | null> => {
  if (!isDatabaseConfigured()) {
    return previewProjects().find((project) => project.slug === slug) ?? null;
  }
  return getPrisma().project.findFirst({
    where: { slug, published: true },
    select: {
      ...projectSummarySelect,
      description: true,
      problem: true,
      solution: true,
      features: true,
      content: true,
      images: { select: { url: true, alt: true }, orderBy: listOrder },
    },
  });
});

const postSelect = {
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  publishedAt: true,
  updatedAt: true,
  category: { select: { name: true, slug: true } },
  tags: { select: { name: true, slug: true }, orderBy: { name: "asc" } },
} satisfies Prisma.PostSelect;

type PostRow = Prisma.PostGetPayload<{ select: typeof postSelect }>;

function toSummary({ content, publishedAt, ...post }: PostRow): PostSummary {
  return {
    ...post,
    publishedAt: publishedAt ?? post.updatedAt,
    readingMinutes: readingMinutes(content),
  };
}

/** Published, and not scheduled for the future. */
const isPublic = () =>
  ({ status: "PUBLISHED", publishedAt: { lte: new Date() } }) satisfies Prisma.PostWhereInput;

export type PostFilters = { q?: string; category?: string; tag?: string };

export async function getPosts(filters: PostFilters = {}, take = 100): Promise<PostSummary[]> {
  if (!isDatabaseConfigured()) return [];
  const { q, category, tag } = filters;
  const where: Prisma.PostWhereInput = {
    ...isPublic(),
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { slug: tag } } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const posts = await getPrisma().post.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take,
    select: postSelect,
  });
  return posts.map(toSummary);
}

export const getPost = cache(async (slug: string): Promise<PostDetail | null> => {
  if (!isDatabaseConfigured()) return null;
  const post = await getPrisma().post.findFirst({
    where: { slug, ...isPublic() },
    select: postSelect,
  });
  return post ? { ...toSummary(post), content: post.content } : null;
});

export async function getRelatedPosts(post: PostDetail): Promise<PostSummary[]> {
  if (!isDatabaseConfigured()) return [];
  const tagSlugs = post.tags.map((tag) => tag.slug);
  const related = await getPrisma().post.findMany({
    where: {
      ...isPublic(),
      slug: { not: post.slug },
      OR: [
        { tags: { some: { slug: { in: tagSlugs } } } },
        ...(post.category ? [{ category: { slug: post.category.slug } }] : []),
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: postSelect,
  });
  return related.map(toSummary);
}

/** Categories and tags that have at least one public post. */
export async function getPostFacets() {
  if (!isDatabaseConfigured()) return { categories: [], tags: [] };
  const some = isPublic();
  const prisma = getPrisma();
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      where: { posts: { some } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.tag.findMany({
      where: { posts: { some } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);
  return { categories, tags };
}
