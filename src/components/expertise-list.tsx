import { Reveal } from "@/components/motion/reveal";
import { Tags } from "@/components/ui/tags";
import { expertise } from "@/content/site-copy";
import type { SkillGroup } from "@/types";

/** Skills come from site settings; anything not placed in a group is still listed. */
export function ExpertiseList({ groups }: { groups: SkillGroup[] }) {
  const listed = groups.flatMap((group) => group.skills);
  const rows = expertise.map((item) => ({
    ...item,
    skills: listed.filter((skill) => item.skills.some((name) => name.toLowerCase() === skill.toLowerCase())),
  }));
  const placed = new Set(rows.flatMap((row) => row.skills));
  const rest = [...new Set(listed.filter((skill) => !placed.has(skill)))];

  return (
    <div className="border-b border-line">
      {rows.map((row, index) => (
        <Reveal
          key={row.title}
          index={index % 3}
          className="group/row grid gap-x-10 gap-y-4 border-t border-line py-8 transition-colors duration-500 hover:border-text sm:py-10 lg:grid-cols-[5fr_7fr]"
        >
          <h3 className="text-2xl transition-[color,transform] duration-500 ease-out group-hover/row:translate-x-2 group-hover/row:text-accent sm:text-3xl">
            {row.title}
          </h3>
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-soft">{row.text}</p>
            <Tags items={row.skills} className="mt-5 text-accent" />
          </div>
        </Reveal>
      ))}
      {rest.length ? (
        <div className="grid gap-x-10 gap-y-4 border-t border-line py-8 lg:grid-cols-[5fr_7fr]">
          <h3 className="text-2xl sm:text-3xl">Also working with</h3>
          <Tags items={rest} className="self-center text-accent" />
        </div>
      ) : null}
    </div>
  );
}
