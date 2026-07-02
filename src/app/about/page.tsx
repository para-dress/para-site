import { PageHero } from "@/components/site/PageHero";

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About Para Dress"
        title="A more personal bridal brand, shaped by craft and clarity."
        body="Para Dress is built for brides who want premium design, direct communication, and a calmer path to choosing the right gown."
      />

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-[var(--site-max-width)] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Our point of view</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">Luxury should feel intentional, not overwhelming.</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            <p>Each gown is handcrafted in Ukraine and offered directly, allowing brides to feel closer to the making process and more confident in the guidance they receive.</p>
            <p>Instead of boutique pressure, Para Dress focuses on communication, fit support, and carefully chosen silhouettes that feel feminine, modern, and lasting.</p>
            <p>The result is a bridal experience that feels quieter, more considered, and more personal from first enquiry to final delivery.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
