import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

/** A highlighted Python excerpt. Code is fenced with more backticks than it contains. */
export function CodePanel({ code, label, url }: { code: string; label: string; url: string | null }) {
  const fence = "`".repeat(Math.max(3, ...(code.match(/`+/g) ?? []).map((run) => run.length + 1)));
  return (
    <figure className="min-w-0">
      <div className="code-panel border border-ink-line p-5 sm:p-8" tabIndex={0} role="group" aria-label="Code excerpt">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {`${fence}python\n${code}\n${fence}`}
        </ReactMarkdown>
      </div>
      {label ? (
        <figcaption className="mt-3 text-sm text-ink-soft">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="link transition-colors hover:text-ink-text">
              {label}
            </a>
          ) : (
            label
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}
