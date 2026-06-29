"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    eyebrow: "Para Dress",
    title: "Luxury bridalwear for the bride who wants calm elegance.",
    body: "A refined collection shaped for modern brides in the UK, with a more personal path from first enquiry to final dress.",
    image: "/site-assets/an3000.jpg",
    alt: "Two minimal bridal gowns standing in an arched studio setting.",
    imageClass: "object-contain object-center object-[center_58%]",
  },
  {
    eyebrow: "Modern minimal",
    title: "Clean lines, soft structure, and quiet confidence.",
    body: "For brides drawn to clarity, restraint, and a more elevated silhouette.",
    image: "/site-assets/an2211.jpg",
    alt: "Modern bridal gown shown with full figure visible.",
    imageClass: "object-contain object-center",
  },
];

const collectionCards = [
  {
    name: "Modern Minimal",
    description: "Refined silhouettes with a lighter, architectural feel.",
    image: "/site-assets/an3002.jpg",
    alt: "Minimal strapless bridal gown with a clean silhouette.",
  },
  {
    name: "Romantic Detail",
    description: "Texture, embellishment, and softness with a couture mood.",
    image: "/site-assets/an3001.jpg",
    alt: "Romantic embellished wedding dress with delicate detail.",
  },
];

const socialProof = [
  {
    title: "Bride feedback",
    body: "Needs Updating",
  },
  {
    title: "Client moments",
    body: "Needs Updating",
  },
  {
    title: "Instagram gallery",
    body: "Needs Updating",
  },
];

const faqItems = [
  {
    question: "What is the price range?",
    answer:
      "Most Para Dress designs are priced between £699 and £950, depending on the style.",
  },
  {
    question: "Do you offer custom sizing?",
    answer:
      "Yes. Custom sizing is available for an additional £100.",
  },
  {
    question: "How long does production take?",
    answer:
      "Up to 50 days for standard sizing and up to 60 days for custom sizing.",
  },
  {
    question: "How do I start?",
    answer:
      "Begin with an enquiry or consultation, and we will guide you through style, sizing, and next steps.",
  },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-6 py-7 transition-colors duration-500 sm:px-10 lg:px-16 ${
          isScrolled ? "bg-transparent" : "bg-[var(--color-cream)]/92"
        }`}
      >
        <div className={`text-center transition-opacity duration-300 ${isScrolled ? "opacity-72" : "opacity-88"}`}>
          <p className="font-display text-[2.2rem] font-medium tracking-[0.34em] text-[var(--color-ink)] sm:text-[3rem]">
            PARA
          </p>
          <p className="-mt-1 text-[0.72rem] uppercase tracking-[0.55em] text-[var(--color-muted)] sm:text-[0.82rem]">
            DRESS
          </p>
        </div>
      </header>

      <section className="snap-y snap-mandatory">
        {heroSlides.map((slide, index) => (
          <section key={slide.title} className="relative h-screen snap-start snap-always overflow-hidden bg-[#ece2da]">
            <Image src={slide.image} alt={slide.alt} fill priority={index === 0} className={slide.imageClass} sizes="100vw" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.03)_0%,rgba(247,240,234,0.08)_32%,rgba(247,240,234,0.26)_100%)]" />

            <div className="relative z-10 mx-auto flex h-screen max-w-7xl flex-col justify-end px-6 pb-18 pt-32 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 lg:pt-36">
              <div className="max-w-2xl space-y-5">
                <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[rgba(120,82,25,0.94)]">{slide.eyebrow}</p>
                <h1 className={`${index === 0 ? "max-w-3xl text-4xl sm:text-5xl lg:text-6xl" : "max-w-2xl text-3xl sm:text-4xl lg:text-5xl"} font-display font-medium leading-[0.95] text-[rgba(110,72,18,0.97)]`}>
                  {slide.title}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-[rgba(97,70,33,0.94)] sm:text-base sm:leading-8">
                  {slide.body}
                </p>
                {index === 0 ? (
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <a
                      href="#collections"
                      className="inline-flex min-h-14 items-center justify-center rounded-full bg-[var(--color-ink-strong)] px-7 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:opacity-92"
                    >
                      Explore Collection
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex min-h-14 items-center justify-center rounded-full border border-[rgba(110,72,18,0.22)] bg-[rgba(247,240,234,0.74)] px-7 text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-ink-strong)] backdrop-blur-[2px] transition hover:bg-[rgba(247,240,234,0.88)]"
                    >
                      Book Consultation
                    </a>
                  </div>
                ) : (
                  <a
                    href="#collections-grid"
                    className="inline-flex pt-2 text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)]"
                  >
                    View Collection
                  </a>
                )}
              </div>
            </div>
          </section>
        ))}
      </section>

      <section className="bg-white px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Brand story</p>
            <h2 className="font-display max-w-lg text-4xl font-medium leading-[1.02] sm:text-5xl">
              Para Dress exists for brides who want something more personal than a catalogue.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            <p>
              Para Dress brings together premium bridal styling, direct guidance, and a calmer way to choose your dress.
            </p>
            <p>
              The collection is produced in Ukraine, where craftsmanship, detail, and femininity remain at the centre of each piece.
            </p>
            <p>
              For the bride, that means a more thoughtful experience, from first conversation to final choice.
            </p>
          </div>
        </div>
      </section>

      <section id="collections-grid" className="px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Collection direction</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">
              Two distinct bridal moods, held within one premium point of view.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {collectionCards.map((item) => (
              <article key={item.name} className="overflow-hidden bg-[var(--color-blush)]">
                <div className="relative aspect-[0.84/1] overflow-hidden">
                  <Image src={item.image} alt={item.alt} fill className="object-contain object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
                <div className="space-y-4 px-1 pb-2 pt-6 sm:pr-12">
                  <h3 className="font-display text-3xl font-medium sm:text-4xl">{item.name}</h3>
                  <p className="max-w-md text-base leading-7 text-[var(--color-muted)]">{item.description}</p>
                  <a href="#contact" className="inline-flex text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)]">
                    Enquire about this dress
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="collections" className="relative min-h-screen overflow-hidden bg-[#ece2da]">
        <div className="absolute inset-0">
          <Image
            src="/site-assets/an3003.jpg"
            alt="Full bridal look with dramatic silhouette and visible head."
            fill
            className="object-contain object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.02)_0%,rgba(247,240,234,0.08)_34%,rgba(247,240,234,0.24)_100%)]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="max-w-xl space-y-5">
            <p className="text-sm uppercase tracking-[0.28em] text-[rgba(120,82,25,0.94)]">Editorial focus</p>
            <h2 className="font-display text-4xl font-medium leading-[0.98] text-[rgba(110,72,18,0.97)] sm:text-5xl lg:text-6xl">
              A slower, more visual way to discover the right bridal direction.
            </h2>
            <p className="text-base leading-8 text-[rgba(97,70,33,0.94)] sm:text-lg">
              Less noise, stronger imagery, and clearer choices for the bride who wants confidence from the first impression.
            </p>
            <a href="#contact" className="inline-flex text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)]">
              Book a consultation
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="relative aspect-[0.82/1] overflow-hidden bg-[var(--color-blush)]">
              <Image
                src="/site-assets/an3001.jpg"
                alt="Romantic embellished wedding dress with delicate detail."
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
            </div>
            <div className="relative aspect-[0.82/1] overflow-hidden bg-[var(--color-blush)] sm:translate-y-10">
              <Image
                src="/site-assets/an3002.jpg"
                alt="Minimal strapless bridal gown with a clean silhouette."
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
            </div>
          </div>
          <div className="space-y-5 lg:pl-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Craftsmanship</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">
              Details, fabrics, and finish deserve their own moment.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Needs Updating
            </p>
            <a href="#contact" className="inline-flex text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)]">
              Enquire about craftsmanship
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-[var(--color-cream)] px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Bridal journey</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">
              A clear process, designed to feel more guided and less overwhelming.
            </h2>
          </div>
          <div className="grid gap-px bg-[var(--color-line)] md:grid-cols-2 xl:grid-cols-4">
            {[
              "Choose a style direction and send your enquiry.",
              "Receive guidance on fit, measurements, and sizing options.",
              "Confirm your order with a 50% deposit.",
              "Production takes up to 50 days standard or 60 days custom.",
            ].map((step, index) => (
              <div key={step} className="bg-[var(--color-cream)] px-6 py-8">
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-muted)]">Step {index + 1}</p>
                <p className="mt-5 max-w-[18rem] text-base leading-7 text-[var(--color-ink-strong)]">{step}</p>
              </div>
            ))}
          </div>
          <a href="#contact" className="inline-flex text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)]">
            Book consultation
          </a>
        </div>
      </section>

      <section className="px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Social proof</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">
              Trust should feel present throughout the experience.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {socialProof.map((item) => (
              <article key={item.title} className="min-h-[220px] border border-[var(--color-line)] bg-white px-6 py-7">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{item.title}</p>
                <p className="mt-8 font-display text-2xl leading-tight text-[var(--color-ink-strong)] sm:text-3xl">{item.body}</p>
              </article>
            ))}
          </div>
          <a href="#contact" className="inline-flex text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)]">
            View collection
          </a>
        </div>
      </section>

      <section id="faq" className="bg-white px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">FAQ</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">
              The practical details, kept clear and understated.
            </h2>
          </div>
          <div className="border-t border-[var(--color-line)]">
            {faqItems.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <article key={faq.question} className="border-b border-[var(--color-line)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
                  >
                    <span className="text-lg font-medium text-[var(--color-ink-strong)] sm:text-xl">{faq.question}</span>
                    <span className="text-2xl leading-none text-[var(--color-muted)]">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen ? (
                    <div className="max-w-2xl pb-7 pr-10 text-base leading-8 text-[var(--color-muted)]">
                      {faq.answer}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
        <a
          href="#contact"
          aria-label="Open contact section"
          className="inline-flex min-h-13 items-center justify-center rounded-full bg-[var(--color-ink-strong)] px-5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(35,27,24,0.16)] transition hover:opacity-92 sm:min-h-14 sm:px-6"
        >
          Contact
        </a>
      </div>

      <section id="contact" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-6xl border border-[var(--color-line)] bg-[var(--color-ink-strong)] text-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.86fr]">
            <div className="space-y-6 px-8 py-10 sm:px-12 sm:py-14">
              <p className="text-sm uppercase tracking-[0.28em] text-white/60">Consultation</p>
              <h2 className="font-display max-w-xl text-4xl font-medium text-white sm:text-5xl">
                A premium enquiry experience should feel just as considered as the dress itself.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/74 sm:text-lg">
                Start with an enquiry and we will guide you through style direction, pricing, sizing, and next steps.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:hello@paradress.co.uk"
                  className="inline-flex min-h-14 items-center justify-center bg-white px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#6f4d1f] transition hover:opacity-92"
                >
                  Book a Consultation
                </a>
                <a
                  href="https://instagram.com/para.dress"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center border border-white/20 px-7 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-white/8"
                >
                  Message on Instagram
                </a>
              </div>
            </div>
            <div className="border-l-0 border-white/10 px-8 py-10 sm:px-12 sm:py-14 lg:border-l">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">Craftsmanship details</p>
                  <p className="mt-3 text-base leading-7 text-white/74">Needs Updating</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">Client proof</p>
                  <p className="mt-3 text-base leading-7 text-white/74">Needs Updating</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">Instagram gallery</p>
                  <p className="mt-3 text-base leading-7 text-white/74">Needs Updating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
