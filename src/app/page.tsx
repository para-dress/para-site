import Image from "next/image";
import Link from "next/link";

const featuredCollections = [
  {
    title: "Modern Minimal",
    description: "Architectural silhouettes, cleaner lines, and a quieter bridal mood.",
    image: "/site-assets/an2308.jpg",
    alt: "Modern minimal bridal gown with a refined silhouette.",
  },
  {
    title: "Romantic Detail",
    description: "Soft embellishment, texture, and a more couture sense of occasion.",
    image: "/site-assets/an2207.jpg",
    alt: "Romantic editorial bridal gown with lace detail.",
  },
];

const featuredStyles = [
  {
    title: "Minimal statement",
    body: "Clean silhouettes for brides drawn to precision, structure, and quieter drama.",
    image: "/site-assets/an2202.jpg",
  },
  {
    title: "Soft couture",
    body: "Romantic gowns with texture, embellishment, and a more expressive bridal mood.",
    image: "/site-assets/an2201.jpg",
  },
  {
    title: "Modern volume",
    body: "Shapes with presence, movement, and a stronger fashion-led silhouette.",
    image: "/site-assets/an2219.jpg",
  },
];

const whyChoose = [
  "Handcrafted in Ukraine and offered directly from our atelier.",
  "Clear personal guidance on style, sizing, and timing.",
  "A premium bridal experience without boutique markup pressure.",
];

const reviews = [
  {
    quote:
      "The process felt calm, personal, and far more considered than a typical bridal appointment.",
    source: "UK bride",
  },
  {
    quote:
      "I loved having direct contact and honest guidance while choosing the right silhouette.",
    source: "Para Dress client",
  },
  {
    quote:
      "The dress felt beautifully made, and the whole experience felt genuinely premium.",
    source: "Recent order",
  },
];

const faqItems = [
  {
    question: "What is the price range?",
    answer: "Most Para Dress gowns are priced between £699 and £950 depending on the style.",
  },
  {
    question: "How long does production take?",
    answer: "Up to 50 days for standard sizing and up to 60 days for custom sizing.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#ece2da] text-white">
        <div className="absolute inset-0">
          <Image
            src="/site-assets/an2216.jpg"
            alt="Editorial Para Dress bridal hero image."
            fill
            priority
            className="object-cover object-[center_18%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.06)_0%,rgba(247,240,234,0.03)_22%,rgba(23,17,14,0.22)_58%,rgba(23,17,14,0.62)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[var(--site-max-width)] items-end px-6 pb-10 pt-28 sm:px-10 sm:pb-12 sm:pt-36 lg:px-16 lg:pb-20 lg:pt-40">
          <div className="max-w-[28rem] space-y-5 sm:max-w-[34rem] lg:max-w-[40rem] lg:space-y-7">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/72">Para Dress</p>
            <h1 className="font-display text-5xl leading-[0.94] text-balance sm:text-6xl lg:text-[5.4rem]">
              Modern bridalwear with a quieter, more personal sense of luxury.
            </h1>
            <p className="max-w-[29rem] text-base leading-8 text-white/84 sm:text-lg">
              Handcrafted gowns, direct guidance, and a refined bridal experience for brides across the UK.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/collections"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/18 bg-white px-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#6f4d1f] shadow-[0_12px_30px_rgba(20,14,11,0.12)] transition hover:bg-[rgba(255,255,255,0.92)]"
              >
                <span className="text-[#6f4d1f]">Explore Collections</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[var(--site-max-width)] space-y-8 sm:space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Featured collections</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">
              Two collection moods, one refined brand world.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            {featuredCollections.map((item, index) => (
              <article key={item.title} className="space-y-5">
                <div className={`relative aspect-[0.85/1] overflow-hidden bg-[var(--color-blush)] ${index === 1 ? "lg:mt-16" : ""}`}>
                  <Image src={item.image} alt={item.alt} fill className="object-contain object-center" sizes="(max-width: 1023px) 100vw, 50vw" />
                </div>
                <div className="max-w-md space-y-3">
                  <h3 className="font-display text-3xl text-[var(--color-ink-strong)] sm:text-4xl">{item.title}</h3>
                  <p className="text-base leading-7 text-[var(--color-muted)]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[var(--site-max-width)] space-y-8 sm:space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Featured styles</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">
              Where should I begin exploring?
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredStyles.map((item) => (
              <article key={item.title} className="space-y-4">
                <div className="relative aspect-[0.9/1] overflow-hidden bg-[#efe4dc]">
                  <Image src={item.image} alt={item.title} fill className="object-cover object-center" sizes="(max-width: 1023px) 100vw, 33vw" />
                </div>
                <div className="space-y-2">
                  <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--color-muted)]">{item.title}</p>
                  <p className="max-w-sm font-display text-2xl leading-tight text-[var(--color-ink-strong)] sm:text-[2rem]">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-[var(--site-max-width)] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Why choose Para Dress</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">
              Bridal should feel calmer, more direct, and more considered.
            </h2>
          </div>
          <div className="space-y-6">
            {whyChoose.map((item) => (
              <div key={item} className="border-b border-[var(--color-line)] pb-5 last:border-b-0 last:pb-0">
                <p className="max-w-xl text-base leading-8 text-[var(--color-ink-strong)] sm:text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[var(--site-max-width)] space-y-8 sm:space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Customer reviews</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">
              Trust should feel present, but never loud.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((item) => (
              <article key={item.quote} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
                <p className="font-display text-2xl leading-tight text-[var(--color-ink-strong)]">“{item.quote}”</p>
                <p className="mt-5 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-muted)]">{item.source}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Frequently asked questions</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">
              What do brides usually need to know first?
            </h2>
          </div>
          <div className="border-t border-[var(--color-line)]">
            {faqItems.map((item) => (
              <div key={item.question} className="border-b border-[var(--color-line)] py-5 sm:py-6">
                <p className="text-lg font-medium text-[var(--color-ink-strong)] sm:text-xl">{item.question}</p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:leading-8">{item.answer}</p>
              </div>
            ))}
          </div>
          <div>
            <Link href="/faq" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-line)] px-6 text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)] transition hover:bg-[var(--color-cream)]">
              View Full FAQ
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ink-strong)] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[var(--site-max-width)] rounded-[2rem] border border-white/10 bg-white/6 px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
          <div className="max-w-3xl space-y-5">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-white/56">Next step</p>
            <h2 className="font-display text-4xl leading-[1] text-white sm:text-5xl lg:text-6xl">
              Want personal guidance before choosing your gown?
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
              Book a consultation and we will help you move forward with more clarity.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/18 bg-white px-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#6f4d1f] shadow-[0_12px_30px_rgba(20,14,11,0.12)] transition hover:bg-[rgba(255,255,255,0.92)]">
                <span className="text-[#6f4d1f]">Book Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
