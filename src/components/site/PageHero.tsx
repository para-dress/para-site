type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function PageHero({ eyebrow, title, body }: PageHeroProps) {
  return (
    <section className="bg-[var(--color-cream)] px-6 pb-14 pt-32 sm:px-10 sm:pb-16 sm:pt-36 lg:px-16 lg:pb-20 lg:pt-40">
      <div className="mx-auto max-w-[var(--site-max-width)]">
        <div className="max-w-3xl space-y-5">
          <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">
            {eyebrow}
          </p>
          <h1 className="font-display text-5xl leading-[0.98] text-[var(--color-ink-strong)] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
