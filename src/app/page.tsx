"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "Featured bridal look",
    title: "Minimal elegance with a fashion-led edge.",
    body: "A calm first impression, chosen to set the tone for the collection and build trust from the first screen.",
    image: "/site-assets/an3000.jpg",
    alt: "Two minimal bridal gowns standing in an arched studio setting.",
    imageClass: "object-contain object-center object-[center_58%]",
    panelClass: "max-w-xl",
  },
  {
    eyebrow: "Clean luxury",
    title: "Refined silhouettes for brides who want quiet confidence.",
    body: "Modern shapes, clean lines, and an elegant sense of restraint for a premium bridal look that feels effortless.",
    image: "/site-assets/an2211.jpg",
    alt: "Modern bridal gown shown with full figure visible.",
    imageClass: "object-contain object-center",
    panelClass: "max-w-lg",
  },
  {
    eyebrow: "Romantic statement",
    title: "Soft detail, feminine texture, and a more expressive bridal mood.",
    body: "For brides who still want elegance, but with more texture, softness, and visual depth in the dress itself.",
    image: "/site-assets/an3001.jpg",
    alt: "Romantic embellished wedding dress with visible head and full silhouette.",
    imageClass: "object-contain object-center",
    panelClass: "max-w-lg",
  },
  {
    eyebrow: "Modern femininity",
    title: "A bridal wardrobe shaped by balance, elegance, and clarity.",
    body: "Para Dress is being built for women who want more than a catalogue, with a calmer and more elevated way to discover the right dress.",
    image: "/site-assets/an3003.jpg",
    alt: "Full bridal look with dramatic silhouette and visible head.",
    imageClass: "object-contain object-center",
    panelClass: "max-w-xl",
  },
];

const collections = [
  {
    name: "Modern Minimal",
    description:
      "Clean silhouettes with soft structure, designed for brides who want a refined and quietly luxurious look.",
    accent: "Elegant lines, effortless confidence",
    image: "/site-assets/an3002.jpg",
    alt: "Minimal strapless bridal gown with a clean silhouette.",
  },
  {
    name: "Romantic Detail",
    description:
      "Feminine textures, statement sleeves, and embellished finishing that still feels polished rather than excessive.",
    accent: "Soft drama with a couture feel",
    image: "/site-assets/an3001.jpg",
    alt: "Romantic embellished wedding dress with delicate detail.",
  },
];

const steps = [
  "Choose the dress that feels closest to your bridal vision and send us an enquiry.",
  "We guide you through sizing, measurements, and whether standard or custom sizing is the best fit.",
  "Your order is confirmed with a 50% deposit, and we stay with you through the next steps.",
  "Production takes up to 50 days for standard sizing and up to 60 days for custom sizing.",
];

const faqs = [
  {
    question: "What is the price range?",
    answer:
      "Most Para Dress designs are priced between £699 and £950, depending on the style.",
  },
  {
    question: "Do you offer custom sizing?",
    answer:
      "Yes. Custom sizing is available for an additional £100, with guidance from us throughout the process.",
  },
  {
    question: "How do measurements work?",
    answer:
      "We explain how to take measurements clearly and help you choose the best route, so the process feels supported rather than overwhelming.",
  },
  {
    question: "How long does production take?",
    answer:
      "Up to 50 days for standard sizes and up to 60 days for custom sizing.",
  },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        {slides.map((slide) => (
          <section key={slide.title} className="relative h-screen snap-start snap-always overflow-hidden bg-[#ece2da]">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority
              className={slide.imageClass}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.08)_0%,rgba(247,240,234,0.14)_34%,rgba(247,240,234,0.4)_100%)]" />

            <div className="relative z-10 mx-auto flex h-screen max-w-7xl flex-col justify-end px-6 pb-24 pt-32 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 lg:pt-36">
              <div className={`${slide.panelClass} rounded-[1.5rem] bg-[rgba(247,240,234,0.08)] p-6 sm:p-8`}>
                <p className="text-xs uppercase tracking-[0.28em] text-[rgba(120,82,25,0.95)]">{slide.eyebrow}</p>
                <h1 className="font-display mt-3 text-3xl font-medium leading-tight text-[rgba(110,72,18,0.96)] sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(97,70,33,0.95)] sm:text-base">
                  {slide.body}
                </p>
              </div>
            </div>
          </section>
        ))}
      </section>

      <section className="px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">About Para Dress</p>
            <h2 className="font-display max-w-lg text-4xl font-medium leading-tight sm:text-5xl">
              A bridal experience built around trust, clarity, and a more elevated way to shop for your dress.
            </h2>
          </div>
          <div className="grid gap-6 text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            <p>
              Para Dress is designed for brides who want more than a catalogue. The brand combines premium aesthetics, direct communication, and a made-to-order process that feels calm and personal.
            </p>
            <p>
              Our dresses are produced in Ukraine and selected for women who want elegance, femininity, and modern bridal styling without unnecessary noise.
            </p>
          </div>
        </div>
      </section>

      <section id="collections" className="snap-y snap-mandatory">
        {collections.map((collection) => (
          <section key={collection.name} className="relative h-screen snap-start snap-always overflow-hidden bg-[#ece2da]">
            <Image
              src={collection.image}
              alt={collection.alt}
              fill
              className="object-contain object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.04)_0%,rgba(247,240,234,0.1)_38%,rgba(247,240,234,0.3)_100%)]" />
            <div className="relative z-10 mx-auto flex h-screen max-w-7xl flex-col justify-end px-6 pb-24 pt-32 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 lg:pt-36">
              <div className="max-w-lg rounded-[1.5rem] bg-[rgba(247,240,234,0.08)] p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(120,82,25,0.95)]">{collection.accent}</p>
                <h3 className="font-display mt-3 text-4xl font-medium text-[rgba(110,72,18,0.96)] sm:text-5xl">{collection.name}</h3>
                <p className="mt-4 text-base leading-7 text-[rgba(97,70,33,0.95)] sm:text-lg">{collection.description}</p>
                <a href="#contact" className="mt-6 inline-flex text-sm font-medium uppercase tracking-[0.18em] text-[rgba(110,72,18,0.96)]">
                  Enquire about this direction
                </a>
              </div>
            </div>
          </section>
        ))}
      </section>

      <section id="process" className="border-y border-black/5 bg-white px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">How it works</p>
            <h2 className="font-display max-w-3xl text-4xl font-medium sm:text-5xl">
              A made-to-order process with more guidance and less uncertainty.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-cream)] p-6 shadow-[0_12px_35px_rgba(33,25,22,0.04)]"
              >
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Step {index + 1}</p>
                <p className="text-base leading-7">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">FAQ</p>
            <h2 className="font-display max-w-3xl text-4xl font-medium sm:text-5xl">
              The practical details, explained in a calm and supportive way.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-[1.75rem] border border-[var(--color-line)] bg-white p-6">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 text-base leading-7 text-[var(--color-muted)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6">
        <a
          href="https://instagram.com/para.dress"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Instagram"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(157,122,63,0.18)] bg-[rgba(247,240,234,0.92)] text-[var(--color-ink)] shadow-[0_10px_24px_rgba(35,27,24,0.12)] backdrop-blur-sm transition hover:scale-[1.03]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a
          href="#contact"
          aria-label="Open enquiry section"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(157,122,63,0.18)] bg-[var(--color-ink)] text-[var(--color-cream)] shadow-[0_10px_24px_rgba(35,27,24,0.16)] transition hover:scale-[1.03]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h16v16H4z" />
            <path d="m22 6-10 7L2 6" />
          </svg>
        </a>
      </div>

      <section id="contact" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-ink)] text-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-6 px-8 py-10 sm:px-12 sm:py-14">
              <p className="text-sm uppercase tracking-[0.28em] text-white/65">Enquiry</p>
              <h2 className="font-display max-w-xl text-4xl font-medium text-white sm:text-5xl">
                Ready to explore your dress options with Para Dress?
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Start with an enquiry and we will guide you through style selection, pricing, sizing, and the next steps. If you prefer a quicker conversation, you can also message us directly on Instagram.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:hello@paradress.co.uk"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-ink)] transition hover:opacity-90"
                >
                  Book a Consultation
                </a>
                <a
                  href="https://instagram.com/para.dress"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-white/8"
                >
                  Message on Instagram
                </a>
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden bg-[#ece2da]">
              <Image
                src="/site-assets/an3001.jpg"
                alt="Romantic bridal look used in the contact section"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,7,0.08)_0%,rgba(12,8,7,0.4)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">Suggested flow</p>
                  <ul className="mt-5 space-y-4 text-sm leading-7 text-white/78">
                    <li>• Primary: consultation or enquiry form</li>
                    <li>• Secondary: Instagram for quick questions</li>
                    <li>• Future: WhatsApp, richer contact form, collection pages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
