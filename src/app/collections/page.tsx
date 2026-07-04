import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";

const collectionItems = [
  {
    title: "Modern Minimal",
    description: "Clean lines and sculpted silhouettes for brides who love understated elegance and a more modern bridal mood.",
    image: "/site-assets/an3002.jpg",
  },
  {
    title: "Romantic Detail",
    description: "Texture, detail, and softer gowns for brides who want a more romantic and expressive feel.",
    image: "/site-assets/an3001.jpg",
  },
  {
    title: "New arrivals",
    description: "Recently added styles chosen for their femininity, refinement, and premium bridal presence.",
    image: "/site-assets/an2221.jpg",
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Collections"
        title="Explore bridal styles that feel elevated, feminine, and special."
        body="From cleaner modern silhouettes to softer romantic gowns, each Para Dress style is chosen to help brides find the look that feels most like them."
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
          <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">Tell us which styles you love, and we’ll help you choose the right direction for your style, timing, and sizing needs.</p>
          <div className="pt-2">
            <Link href="/contact" className="inline-flex min-h-13 items-center justify-center rounded-full bg-[var(--color-ink-strong)] px-7 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-[#5f4118]">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
