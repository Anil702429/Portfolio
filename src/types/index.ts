export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialActionState: ActionState = { ok: false, message: "" };

export type SocialLink = { label: string; url: string };
export type SkillGroup = { name: string; skills: string[] };
export type Education = { title: string; institution: string; period: string };

export type SiteSettings = {
  name: string;
  professionalTitle: string;
  introduction: string;
  about: string;
  location: string;
  availability: string;
  profileImage: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  email: string | null;
  resumeUrl: string | null;
  heroSnippet: string;
  heroSnippetLabel: string;
  heroSnippetUrl: string | null;
  socialLinks: SocialLink[];
  skillGroups: SkillGroup[];
  education: Education[];
};

export type ProjectSummary = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  coverImage: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  technologies: { name: string; slug: string }[];
  updatedAt: Date | null;
};

export type ProjectDetail = ProjectSummary & {
  description: string;
  problem: string;
  solution: string;
  features: string[];
  content: string;
  images: { url: string; alt: string }[];
};

export type PostSummary = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date;
  updatedAt: Date;
  readingMinutes: number;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
};

export type PostDetail = PostSummary & { content: string };
