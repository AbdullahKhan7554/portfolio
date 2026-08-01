import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPackage } from '@/lib/supabase/salesPackages';
import { PackageForm } from '../PackageForm';

export const dynamic = 'force-dynamic';

export default async function EditPackagePage({ params }) {
  const { id } = await params;
  const { entry, error } = await getPackage(id);
  if (!error && !entry) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/packages" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
        ← Back to packages
      </Link>
      {error ? (
        <p className="mt-6 text-sm text-red-500">Could not load package: {error}</p>
      ) : (
        <>
          <h1 className="mt-3 text-lg font-semibold text-[var(--text-strong)]">Edit package</h1>
          <PackageForm mode="edit" id={id} initial={entry} />
        </>
      )}
    </div>
  );
}
