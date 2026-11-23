import GithubSlugger from "github-slugger";

export type Heading = { id: string; text: string; level: number };

/** Headings with the same ids rehype-slug generates, ignoring fenced code. */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let fence: string | null = null;
  for (const line of markdown.split(/\r?\n/)) {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (marker.startsWith(fence)) fence = null;
      continue;
    }
    if (fence) continue;
    const match = /^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match?.[1] || !match[2]) continue;
    const text = match[2].replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*]/g, "");
    headings.push({ id: slugger.slug(text), text, level: match[1].length });
  }
  return headings.filter((heading) => heading.level === 2 || heading.level === 3);
}

export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

/** Dates are stored and shown in UTC. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
