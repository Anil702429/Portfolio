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

/** Each level-two heading with the plain text of its first paragraph. */
export function extractSections(markdown: string): { title: string; text: string }[] {
  const plain = (value: string) =>
    value.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*]/g, "").trim();
  const sections: { title: string; text: string }[] = [];
  // Fenced code can contain lines that look like headings.
  const withoutCode = markdown.replace(/\r\n/g, "\n").replace(/^ {0,3}(`{3,}|~{3,})[\s\S]*?^ {0,3}\1.*$/gm, "");
  for (const part of withoutCode.split(/^## +/m).slice(1)) {
    const [title = "", ...rest] = part.split("\n");
    const text = rest.join("\n").trim().split(/\n\s*\n/)[0] ?? "";
    if (title.trim() && text && !/^[#>|!-]/.test(text)) {
      sections.push({ title: plain(title), text: plain(text.replace(/\n/g, " ")) });
    }
  }
  return sections;
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
