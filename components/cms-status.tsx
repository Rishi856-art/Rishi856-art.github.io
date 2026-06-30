export function CmsStatus({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="page-shell pt-28 sm:pt-32">
      <div className="rounded-2xl border border-gold/25 bg-gold/10 px-5 py-4 text-sm leading-6 text-gold">
        {message} Uploaded photos and admin login will work again after the Supabase project is restored.
      </div>
    </div>
  );
}
