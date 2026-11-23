export function PageLoading() {
  return (
    <div role="status">
      <span className="sr-only">Loading</span>
      <div className="h-72 bg-ink" />
      <div className="container-page py-20 motion-safe:animate-pulse">
        <div className="aspect-16/9 rounded-[3px] bg-tint" />
      </div>
    </div>
  );
}
