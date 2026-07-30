export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse">
      <div className="h-6 w-44 rounded-[var(--radius-md)] bg-[var(--surface)]" />
      <div className="mt-6 h-10 w-full max-w-md rounded-[var(--radius-md)] bg-[var(--surface)]" />
      <div className="mt-4 h-64 w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]" />
    </div>
  );
}
