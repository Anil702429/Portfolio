import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/markdown";
import type { PostSummary } from "@/types";

export function PostCard({ post, heading: Heading = "h2" }: { post: PostSummary; heading?: "h2" | "h3" }) {
  return (
    <article className="grid gap-x-10 gap-y-5 border-t border-line py-9 sm:grid-cols-[1fr_14rem]">
      <div>
        <p className="label text-soft">
          <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>, {post.readingMinutes} min
          read{post.category ? `, in ${post.category.name}` : ""}
        </p>
        <Heading className="mt-3 text-3xl sm:text-4xl">
          <Link href={`/blog/${post.slug}`} className="transition-colors duration-300 hover:text-accent">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-3 max-w-2xl text-lg text-soft">{post.excerpt}</p>
      </div>
      {post.coverImage ? (
        <div className="relative order-first aspect-16/10 overflow-hidden rounded-[3px] sm:order-last">
          <Image src={post.coverImage} alt="" fill sizes="(min-width: 640px) 224px, 100vw" className="object-cover" />
        </div>
      ) : null}
    </article>
  );
}
