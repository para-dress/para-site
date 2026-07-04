import { PageHero } from "@/components/site/PageHero";

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About Para Dress"
        title="Elegant bridal, made to feel more personal."
        body="Para Dress is for brides who want a premium-looking wedding dress, direct support, and a clearer, calmer path to ordering online."
      />

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-[var(--site-max-width)] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Our point of view</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">Beautiful bridal should also feel clear, supportive, and trustworthy.</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            <p>Our dresses are made in Ukraine and offered directly to brides in the UK, allowing us to focus on beautiful design, personal communication, and a more considered ordering experience.</p>
            <p>Instead of traditional boutique pressure, Para Dress focuses on helping each bride feel confident in her choice through clear guidance on styles, sizing, measurements, and timing.</p>
            <p>We believe a wedding dress should look special, feel feminine, and arrive with the reassurance that you have been supported properly from first enquiry to final delivery.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
