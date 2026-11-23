export function PageLoading() {
  return (
    <div role="status">
      <span className="sr-only">Loading</span>
      <div className="h-56 bg-ink" />
      <div className="container-page grid gap-10 py-20 motion-safe:animate-pulse md:grid-cols-2">
        <div className="aspect-16/10 rounded-md bg-tint" />
        <div className="aspect-16/10 rounded-md bg-tint" />
      </div>
    </div>
  );
}
