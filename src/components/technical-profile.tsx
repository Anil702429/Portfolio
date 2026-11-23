import { interests } from "@/content/site-copy";
import type { SiteSettings } from "@/types";

export function TechnicalProfile({ settings }: { settings: SiteSettings }) {
  const rows: [string, string[]][] = [
    ["Role", [settings.professionalTitle]],
    ["Based in", [settings.location]],
    ["Availability", [settings.availability]],
    ["Interests", interests],
    ["Education", settings.education.map((item) => [item.title, item.institution, item.period].filter(Boolean).join(", "))],
  ];
  return (
    <dl className="border-b border-line">
      {rows.map(([term, values]) => {
        const shown = values.filter(Boolean);
        return shown.length ? (
          <div key={term} className="grid gap-x-6 gap-y-1 border-t border-line py-4 sm:grid-cols-[9rem_1fr]">
            <dt className="label pt-0.5 text-soft">{term}</dt>
            {shown.map((value) => (
              <dd key={value} className="sm:col-start-2">
                {value}
              </dd>
            ))}
          </div>
        ) : null;
      })}
    </dl>
  );
}
