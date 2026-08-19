export function OfferBanner({ active, text }: { active?: boolean; text?: string }) {
  if (!active || !text) return null;

  return (
    <div className="bg-primary px-4 py-2 text-center text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-md relative z-50">
      {text}
    </div>
  );
}
