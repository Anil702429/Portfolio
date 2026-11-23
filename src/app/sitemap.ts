import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { getPosts, getProjects } from "@/lib/queries";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [projects, posts] = await Promise.all([getProjects(), getPosts({}, 1000)]);
  return [
    ...["", "/projects", "/about", "/blog", "/contact"].map((path) => ({ url: `${base}${path}` })),
    ...projects.map((project) => ({
      url: `${base}/projects/${encodeURIComponent(project.slug)}`,
      lastModified: project.updatedAt ?? undefined,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt,
    })),
  ];
}
