import { Reveal } from "@/components/motion/reveal";
import { approach } from "@/content/site-copy";

/** The numbers mark a real order of work. */
export function ApproachList() {
  return (
    <ol className="border-b border-ink-line">
      {approach.map((step, index) => (
        <li key={step.title} className="border-t border-ink-line py-5">
          <Reveal index={index} className="grid gap-x-6 gap-y-1 sm:grid-cols-[2rem_1fr]">
          <span className="label pt-1 text-ink-accent" aria-hidden="true">
            {index + 1}
          </span>
          <div>
            <h3 className="text-xl text-ink-text">{step.title}</h3>
            <p className="mt-1.5 text-ink-soft">{step.text}</p>
          </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
