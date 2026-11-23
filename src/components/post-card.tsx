import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/markdown";
import type { PostSummary } from "@/types";

export function PostCard({ post, heading: Heading = "h2" }: { post: PostSummary; heading?: "h2" | "h3" }) {
  return (
    <article className="grid gap-5 border-t border-line py-8 sm:grid-cols-[1fr_13rem] sm:gap-10">
      <div>
        <p className="text-sm text-soft">
          <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>,{" "}
          {post.readingMinutes} min read{post.category ? `, in ${post.category.name}` : ""}
        </p>
        <Heading className="mt-2 text-2xl font-bold">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 max-w-2xl text-soft">{post.excerpt}</p>
      </div>
      {post.coverImage ? (
        <div className="relative order-first aspect-16/10 overflow-hidden rounded-md sm:order-last">
          <Image src={post.coverImage} alt="" fill sizes="(min-width: 640px) 208px, 100vw" className="object-cover" />
        </div>
      ) : null}
    </article>
  );
}
