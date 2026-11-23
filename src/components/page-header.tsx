export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="bg-ink pt-20 pb-14 text-ink-text sm:pt-32 sm:pb-20">
      <div className="container-page grid items-end gap-8 lg:grid-cols-12">
        <h1 className="enter display lg:col-span-8">{title}</h1>
        {children ? <div className="enter text-lg leading-relaxed text-ink-soft [animation-delay:0.12s] lg:col-span-4">{children}</div> : null}
      </div>
    </div>
  );
}
