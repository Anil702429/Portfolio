export function AdminHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {children}
    </div>
  );
}

export function SavedNotice({ show }: { show: boolean }) {
  return show ? (
    <p role="status" className="mb-6 font-medium text-accent">
      Changes saved.
    </p>
  ) : null;
}
