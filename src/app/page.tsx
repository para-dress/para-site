import Image from "next/image";
import Link from "next/link";

const featuredCollections = [
  {
    title: "Modern Minimal",
    description: "Clean, modern silhouettes chosen for brides who love refinement, structure, and understated elegance.",
    image: "/site-assets/an3002.jpg",
    alt: "Minimal bridal silhouette with a clean strapless line.",
  },
  {
    title: "Romantic Detail",
    description: "Softer gowns with texture, detail, and a more romantic bridal feeling.",
    image: "/site-assets/an3001.jpg",
    alt: "Romantic bridal gown with embellishment and texture.",
  },
];

const featuredStyles = [
  {
    title: "Minimal statement",
    body: "For brides drawn to precision, clean lines, and a more understated kind of drama.",
    image: "/site-assets/an2211.jpg",
  },
  {
    title: "Soft couture",
    body: "For brides who want softness, texture, and a more expressive romantic feel.",
    image: "/site-assets/an3000.jpg",
  },
  {
    title: "Modern volume",
    body: "For brides who want presence, movement, and a silhouette that feels more fashion-led.",
    image: "/site-assets/an3003.jpg",
  },
];

const whyChoose = [
  "Premium-feel bridal with elegant silhouettes and refined details.",
  "Personal guidance on styles, sizing, measurements, and timing.",
  "A luxury feel without traditional boutique-level markup.",
  "Custom sizing available for brides who want a more personal fit.",
  "Made in Ukraine with care and attention to detail.",
];

const trustPoints = [
  {
    title: "Clear sizing guidance",
    body: "We help brides understand whether standard or custom sizing is the right choice before ordering.",
  },
  {
    title: "Personal support",
    body: "Every enquiry is handled with direct communication and thoughtful guidance from first message to order.",
  },
  {
    title: "Transparent timelines",
    body: "We explain production timing, deposits, and delivery expectations clearly so brides know what to expect.",
  },
  {
    title: "Custom sizing available",
    body: "For brides who want a more personal fit, custom sizing is available for +£100.",
  },
];

const orderSteps = [
  "Choose your favourite styles.",
  "Send us your enquiry.",
  "We guide you on sizing and measurements.",
  "Your order begins with a 50% deposit.",
  "Your dress is prepared and delivered to the UK.",
];

const faqItems = [
  {
    question: "What is the price range?",
    answer: "Most Para Dress gowns are priced between £699 and £950 depending on the style.",
  },
  {
    question: "Do you offer custom sizing?",
    answer: "Yes. Custom sizing is available for +£100.",
  },
  {
    question: "How long does production take?",
    answer: "Up to 50 days for standard sizing and up to 60 days for custom sizing.",
  },
  {
    question: "What deposit is required?",
    answer: "A 50% deposit is required to begin production.",
  },
  {
    question: "Can I return a custom-sized dress?",
    answer:
      "Custom-sized dresses are non-returnable, as they are made specifically to the bride’s measurements. We take custom sizing very seriously and guide each bride carefully through the measurement process to help ensure the best possible fit. To date, we have not had return requests for custom-sized orders. In the rare event that minor local alterations are needed, we are happy to contribute towards atelier adjustment costs.",
  },
  {
    question: "What about standard-size dresses?",
    answer:
      "Standard-size dresses are also prepared with great care for each bride. For this reason, exchanges or replacements are not provided after shipment. We’re always happy to guide you through sizing before the order begins, so you can feel more confident in your choice.",
  },
  {
    question: "When is the final payment due?",
    answer:
      "The remaining balance is requested only once the dress is ready and all final details have been reviewed and confirmed with the bride. Payment is then completed shortly before shipment.",
  },
  {
    question: "How do I choose the right size?",
    answer: "We guide each bride through sizing and measurements before production begins.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#ece2da] text-white">
        <div className="absolute inset-0">
          <Image
            src="/site-assets/an3000.jpg"
            alt="Editorial Para Dress bridal image."
            fill
            priority
            className="object-cover object-[center_22%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.06)_0%,rgba(247,240,234,0.03)_22%,rgba(23,17,14,0.22)_58%,rgba(23,17,14,0.62)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[var(--site-max-width)] items-end px-6 pb-10 pt-28 sm:px-10 sm:pb-12 sm:pt-36 lg:px-16 lg:pb-20 lg:pt-40">
          <div className="max-w-[28rem] space-y-5 sm:max-w-[34rem] lg:max-w-[40rem] lg:space-y-7">
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-white/72">Para Dress</p>
            <h1 className="font-display text-5xl leading-[0.94] text-balance sm:text-6xl lg:text-[5.4rem]">
              Find the wedding dress that feels like you
            </h1>
            <p className="max-w-[29rem] text-base leading-8 text-white/84 sm:text-lg">
              Elegant, premium-looking bridal dresses made in Ukraine for brides in the UK — with personal support and custom sizing available.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/collections"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/18 bg-white px-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#6f4d1f] shadow-[0_12px_30px_rgba(20,14,11,0.12)] transition hover:bg-[rgba(255,255,255,0.92)]"
              >
                <span className="text-[#6f4d1f]">Explore the Collection</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/24 bg-white/8 px-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/14"
              >
                Enquire Now
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
              Discover bridal styles with two distinct moods
            </h2>
            <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              From clean, modern silhouettes to softer romantic gowns, each Para Dress style is chosen to feel feminine, elevated, and special.
            </p>
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
              Start with the style that feels most like you
            </h2>
            <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Whether you love clean minimal lines, softer couture-inspired details, or more dramatic volume, we’ll help you find the right direction.
            </p>
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
              Why brides choose Para Dress
            </h2>
            <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Premium-looking bridal dresses, personal support, and a more thoughtful path to finding the right gown.
            </p>
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
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">Ordering with confidence</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">
              Ordering online should still feel reassuring.
            </h2>
            <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              We know choosing a wedding dress online is a big decision. That’s why we focus on clear communication, measurement guidance, transparent timelines, and personal support at every step.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {trustPoints.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-muted)]">{item.title}</p>
                <p className="mt-4 text-base leading-8 text-[var(--color-ink-strong)] sm:text-lg">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[var(--site-max-width)] space-y-8 sm:space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-muted)]">How to order</p>
            <h2 className="font-display text-4xl leading-[1] text-[var(--color-ink-strong)] sm:text-5xl">
              How to order your dress
            </h2>
            <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              We keep the process clear, personal, and supportive from first enquiry to final delivery.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {orderSteps.map((step, index) => (
              <div key={step} className="rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-cream)] p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-muted)]">Step {index + 1}</p>
                <p className="mt-3 text-base leading-7 text-[var(--color-ink-strong)]">{step}</p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-7 text-[var(--color-muted)] sm:text-base">
            Custom sizing is available for +£100.
          </p>
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
              Ready to find your dress?
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
              If you already have a style in mind — or want help choosing the right one — send us a message and we’ll guide you from there.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/18 bg-white px-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#6f4d1f] shadow-[0_12px_30px_rgba(20,14,11,0.12)] transition hover:bg-[rgba(255,255,255,0.92)]">
                <span className="text-[#6f4d1f]">Enquire Now</span>
              </Link>
              <a href="https://instagram.com/para.dress" target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/18 bg-white/8 px-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/14">
                Message Us on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
