import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";

const collectionItems = [
  {
    title: "Modern Minimal",
    description: "Clean lines, sculpted silhouettes, and a more architectural bridal mood.",
    image: "/site-assets/an3002.jpg",
  },
  {
    title: "Romantic Detail",
    description: "Texture, embellishment, and softer gowns with couture feeling.",
    image: "/site-assets/an3001.jpg",
  },
  {
    title: "New arrivals",
    description: "Recently added styles chosen for their balance of femininity and refinement.",
    image: "/site-assets/an2211.jpg",
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Collections"
        title="A curated bridal wardrobe with two distinct moods."
        body="Explore cleaner modern silhouettes and more romantic statement gowns, all guided by the same refined Para Dress point of view."
      />

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-[var(--site-max-width)] gap-10 lg:grid-cols-3">
          {collectionItems.map((item) => (
            <article key={item.title} className="space-y-5">
              <div className="relative aspect-[0.86/1] overflow-hidden bg-[var(--color-blush)]">
                <Image src={item.image} alt={item.title} fill className="object-contain object-center" sizes="(max-width: 1023px) 100vw, 33vw" />
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-3xl text-[var(--color-ink-strong)] sm:text-4xl">{item.title}</h2>
                <p className="text-base leading-7 text-[var(--color-muted)]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Need guidance?</p>
          <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">Not sure which direction feels most like you?</h2>
          <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">Start with a consultation and we will guide you toward silhouettes that suit your style, timing, and measurements.</p>
          <div className="pt-2">
            <Link href="/contact" className="inline-flex min-h-13 items-center justify-center rounded-full bg-[var(--color-ink-strong)] px-7 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-[#5f4118]">
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
