import Link from 'next/link';
import { PackageForm } from '../PackageForm';

export const dynamic = 'force-dynamic';

export default function NewPackagePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/packages" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
        ← Back to packages
      </Link>
      <h1 className="mt-3 text-lg font-semibold text-[var(--text-strong)]">New package</h1>
      <PackageForm mode="create" />
    </div>
  );
}
