export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="bg-ink py-14 text-white sm:py-20">
      <div className="container-page">
        <h1 className="max-w-4xl text-4xl font-bold sm:text-6xl">{title}</h1>
        {children ? <div className="mt-5 max-w-2xl text-lg text-ink-soft">{children}</div> : null}
      </div>
    </div>
  );
}
