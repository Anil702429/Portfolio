import Image from "next/image";
import { Arrow } from "@/components/ui/arrow";
import type { ProjectSummary } from "@/types";

const mats = ["bg-cobalt", "bg-[#d3cdbd] dark:bg-[#3a3833]", "bg-[#26282c]"];

/**
 * Screenshot set into a mat, always 16:10. Inside a "group/card" the image zooms
 * and a caption bar slides in on hover or keyboard focus.
 */
export function ProjectCover({
  project,
  sizes,
  mat = 0,
  preload = false,
  caption,
}: {
  project: Pick<ProjectSummary, "title" | "coverImage">;
  sizes: string;
  mat?: number;
  preload?: boolean;
  caption?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[3px] px-[6%] pt-[6%] after:pointer-events-none after:absolute after:inset-0 after:rounded-[3px] after:border after:border-transparent after:transition-colors after:duration-500 group-hover/card:after:border-text/60 group-focus-within/card:after:border-text/60 ${mats[mat % mats.length]}`}
    >
      <div className="relative aspect-16/10 overflow-hidden rounded-t-[3px] bg-surface">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes={sizes}
            preload={preload}
            className="origin-top object-cover object-top transition-transform duration-1000 ease-out group-hover/card:scale-[1.035] group-focus-within/card:scale-[1.035]"
          />
        ) : (
          <span
            className="absolute inset-0 grid place-items-center px-6 text-center font-display text-4xl font-semibold text-soft"
            aria-hidden="true"
          >
            {project.title}
          </span>
        )}
      </div>
      {caption ? (
        <div
          aria-hidden="true"
          className="group absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-between bg-[#111214] px-6 py-4 font-semibold text-[#f3f1ea] transition-transform duration-500 ease-out group-hover/card:translate-y-0 group-focus-within/card:translate-y-0 hover-device:flex"
        >
          {caption}
          <Arrow className="group-hover/card:translate-x-1" />
        </div>
      ) : null}
    </div>
  );
}
