"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const heroSlides = [
  {
    eyebrow: "Para Dress",
    title: "Handcrafted in Ukraine, guided personally, and offered directly from our own atelier.",
    body: "Made-to-order gowns for brides across the UK, with personal sizing guidance and no bridal boutique markups.",
    image: "/site-assets/an3000.jpg",
    alt: "Two minimal bridal gowns standing in an arched studio setting.",
    imageClass: "object-contain object-center object-[center_58%]",
  },
  {
    eyebrow: "Direct bridal experience",
    title: "A calmer, more personal way to find the right gown.",
    body: "Direct communication, clear guidance, and a closer connection to the people making the dress.",
    image: "/site-assets/an2211.jpg",
    alt: "Modern bridal gown shown with full figure visible.",
    imageClass: "object-contain object-center",
  },
];

const trustPoints = [
  "Handcrafted in Ukraine",
  "Direct from our atelier",
  "Made to order",
  "Personal sizing guidance",
  "No bridal boutique markups",
  "Delivered across the UK",
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
    description: "Texture and softness with a couture mood.",
    image: "/site-assets/an3001.jpg",
    alt: "Romantic embellished wedding dress with delicate detail.",
  },
];

const socialProof = [
  {
    title: "Bride feedback",
    body: "Kind words from brides who valued both the gowns and the care behind the experience.",
  },
  {
    title: "Client moments",
    body: "Real bridal moments, shared with warmth, trust, and a sense of occasion.",
  },
  {
    title: "Instagram gallery",
    body: "A visual diary of silhouettes, details, fittings, and finished bridal looks.",
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
    answer: "Yes. Custom sizing is available for an additional £100.",
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
  const snapLockRef = useRef(false);
  const snapPausedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const wheelAccumRef = useRef(0);
  const wheelResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".snap-section[data-snap='true']"));
    if (!sections.length) return;

    const releaseLock = () => {
      window.setTimeout(() => {
        snapLockRef.current = false;
      }, 480);
    };

    const getCurrentSectionIndex = () => {
      const scrollY = window.scrollY;
      let currentIndex = 0;

      for (let index = 0; index < sections.length; index += 1) {
        const sectionTop = sections[index].offsetTop;
        const nextTop = sections[index + 1]?.offsetTop ?? Number.POSITIVE_INFINITY;
        const threshold = sectionTop + (nextTop - sectionTop) * 0.38;

        if (scrollY < threshold) {
          currentIndex = index;
          break;
        }

        currentIndex = index;
      }

      return currentIndex;
    };

    const snapToSection = (direction: 1 | -1) => {
      if (snapLockRef.current) return;

      const currentIndex = getCurrentSectionIndex();
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
      const target = sections[targetIndex];

      if (!target || targetIndex === currentIndex) return;

      snapLockRef.current = true;
      window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      releaseLock();
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 4 || snapLockRef.current || snapPausedRef.current) return;

      wheelAccumRef.current += event.deltaY;

      if (wheelResetRef.current) {
        clearTimeout(wheelResetRef.current);
      }

      wheelResetRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
      }, 140);

      if (Math.abs(wheelAccumRef.current) > 34) {
        snapToSection(wheelAccumRef.current > 0 ? 1 : -1);
        wheelAccumRef.current = 0;
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (snapPausedRef.current) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
      touchStartTimeRef.current = Date.now();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (snapLockRef.current || snapPausedRef.current || touchStartYRef.current === null) return;

      const endY = event.changedTouches[0]?.clientY;
      if (typeof endY !== "number") return;

      const deltaY = touchStartYRef.current - endY;
      const elapsed = Date.now() - touchStartTimeRef.current;

      touchStartYRef.current = null;

      if (Math.abs(deltaY) < 28 || elapsed > 360) return;

      snapToSection(deltaY > 0 ? 1 : -1);
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        snapPausedRef.current = true;
      }
    };

    const onFocusOut = () => {
      window.setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        snapPausedRef.current = Boolean(active?.closest("input, textarea, select, [contenteditable='true']"));
      }, 0);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
      if (wheelResetRef.current) clearTimeout(wheelResetRef.current);
    };
  }, []);

  return (
    <main className="snap-container bg-[var(--color-cream)] text-[var(--color-ink)]">
      <header
        className={`fixed inset-x-0 top-0 z-50 flex justify-center px-6 py-7 transition-[transform,opacity,background-color] duration-500 sm:px-10 lg:px-16 ${
          isScrolled ? "-translate-y-8 opacity-0 bg-transparent" : "translate-y-0 opacity-100 bg-[var(--color-cream)]/92"
        }`}
      >
        <div className="pointer-events-none text-center">
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
          <section key={slide.title} data-snap="true" className="snap-section snap-section-screen relative h-screen snap-start overflow-hidden bg-[#ece2da]">
            <Image src={slide.image} alt={slide.alt} fill priority={index === 0} className={slide.imageClass} sizes="100vw" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,239,233,0.12)_0%,rgba(246,239,233,0.1)_24%,rgba(27,20,15,0.16)_60%,rgba(27,20,15,0.42)_100%)]" />

            <div className="relative z-10 mx-auto flex h-screen max-w-7xl flex-col justify-end px-6 pb-18 pt-32 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24 lg:pt-36">
              <div className="max-w-[46rem] space-y-5">
                {index === 0 ? null : (
                  <p className="text-[0.72rem] uppercase tracking-[0.34em] text-white/82">{slide.eyebrow}</p>
                )}
                <h1 className={`${index === 0 ? "max-w-4xl text-4xl sm:text-5xl lg:text-6xl" : "max-w-2xl text-3xl sm:text-4xl lg:text-5xl"} font-display font-medium leading-[0.95] text-white`}>
                  {slide.title}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-white/84 sm:text-base sm:leading-8">
                  {slide.body}
                </p>
                {index === 0 ? (
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <a
                      href="#collections"
                      className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-ink-strong)] transition hover:opacity-92"
                    >
                      Explore Collection
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/24 bg-[rgba(255,255,255,0.08)] px-7 text-sm font-medium uppercase tracking-[0.14em] text-white backdrop-blur-[3px] transition hover:bg-[rgba(255,255,255,0.14)]"
                    >
                      Book Consultation
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </section>

      <section data-snap="true" className="snap-section bg-white px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-7xl border-y border-[var(--color-line)] py-6 sm:py-7">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <span className="mt-[0.45rem] h-[0.32rem] w-[0.32rem] rounded-full bg-[var(--color-ink-strong)]/70" />
                <p className="text-sm leading-6 text-[var(--color-ink-strong)]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-snap="true" className="snap-section bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Brand story</p>
            <h2 className="font-display max-w-md text-4xl font-medium leading-[1.02] sm:text-5xl">
              Direct, personal, and closer to the making of the gown.
            </h2>
          </div>
          <div className="max-w-2xl space-y-4 text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            <p>Para Dress brings together premium bridal styling and direct guidance.</p>
            <p>Each gown is handcrafted in Ukraine and offered straight from our atelier.</p>
            <p>For the bride, that means more clarity, more support, and a more personal experience.</p>
          </div>
        </div>
      </section>

      <section id="collections-grid" data-snap="true" className="snap-section px-0 py-20 sm:py-24 lg:py-28">
        <div className="space-y-12">
          <div className="px-6 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Collection direction</p>
              <h2 className="font-display max-w-xl text-4xl font-medium leading-[1.02] sm:text-5xl">
                Two bridal moods, one refined point of view.
              </h2>
            </div>
          </div>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-8">
            {collectionCards.map((item, index) => (
              <article key={item.name} className="space-y-6">
                <div className={`relative aspect-[0.88/1] overflow-hidden ${index === 1 ? "lg:mt-20" : ""}`}>
                  <Image src={item.image} alt={item.alt} fill className="object-contain object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
                <div className="px-6 sm:px-10 lg:px-12">
                  <h3 className="font-display text-3xl font-medium sm:text-4xl">{item.name}</h3>
                  <p className="mt-3 max-w-sm text-base leading-7 text-[var(--color-muted)]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="collections" data-snap="true" className="snap-section snap-section-screen relative min-h-screen overflow-hidden bg-[#ece2da]">
        <div className="absolute inset-0">
          <Image
            src="/site-assets/an3003.jpg"
            alt="Full bridal look with dramatic silhouette and visible head."
            fill
            className="object-contain object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,239,233,0.02)_0%,rgba(246,239,233,0.02)_36%,rgba(22,16,12,0.22)_70%,rgba(22,16,12,0.52)_100%)]" />
        </div>
      </section>

      <section data-snap="true" className="snap-section bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="relative aspect-[0.82/1] overflow-hidden">
              <Image src="/site-assets/an3001.jpg" alt="Romantic embellished wedding dress with delicate detail." fill className="object-contain object-center" sizes="(max-width: 1024px) 100vw, 30vw" />
            </div>
            <div className="relative aspect-[0.82/1] overflow-hidden sm:translate-y-12">
              <Image src="/site-assets/an3002.jpg" alt="Minimal strapless bridal gown with a clean silhouette." fill className="object-contain object-center" sizes="(max-width: 1024px) 100vw, 30vw" />
            </div>
          </div>
          <div className="max-w-lg space-y-4 lg:pb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Craftsmanship</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">Fabric, finish, and detail deserve room to breathe.</h2>
            <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">Fine fabrics, careful construction, and a couture sensibility sit at the heart of each gown.</p>
          </div>
        </div>
      </section>

      <section data-snap="true" className="snap-section bg-[var(--color-cream)] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Why ordering online is safe</p>
            <h2 className="font-display max-w-lg text-4xl font-medium leading-[1.02] sm:text-5xl">Reassurance should be built into the experience.</h2>
          </div>
          <div className="space-y-7">
            {[
              "We guide every bride through measurements personally.",
              "Sizing is reviewed with individual support before production begins.",
              "Each set of measurements is checked carefully.",
              "Every gown is made individually.",
            ].map((item) => (
              <div key={item} className="border-b border-[var(--color-line)] pb-5 last:border-b-0 last:pb-0">
                <p className="max-w-xl text-base leading-7 text-[var(--color-ink-strong)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-snap="true" className="snap-section bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="max-w-md space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">The people behind Para Dress</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">Real people, real craftsmanship, a more human bridal experience.</h2>
            <p className="text-base leading-8 text-[var(--color-muted)] sm:text-lg">Para Dress is shaped by an atelier team that values detail, femininity, and a more personal relationship with every bride.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="min-h-[220px] border-b border-[var(--color-line)] pb-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Atelier</p>
              <p className="mt-6 font-display text-2xl leading-tight text-[var(--color-ink-strong)] sm:text-3xl">Crafted in Ukraine, with care, precision, and close attention to every silhouette.</p>
            </div>
            <div className="min-h-[220px] border-b border-[var(--color-line)] pb-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Production process</p>
              <p className="mt-6 font-display text-2xl leading-tight text-[var(--color-ink-strong)] sm:text-3xl">Each gown is made to order, then checked with the bride’s sizing and finishing details in mind.</p>
            </div>
          </div>
        </div>
      </section>

      <section data-snap="true" className="snap-section bg-[var(--color-cream)] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Bridal journey</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">A clear process, guided from enquiry to production.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Choose a style direction and send your enquiry.",
              "Receive guidance on fit, measurements, and sizing.",
              "Confirm your order with a 50% deposit.",
              "Production takes up to 50 days standard or 60 days custom.",
            ].map((step, index) => (
              <div key={step} className="space-y-4">
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-muted)]">Step {index + 1}</p>
                <p className="max-w-[16rem] text-base leading-7 text-[var(--color-ink-strong)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-snap="true" className="snap-section bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="max-w-xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Social proof</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">Trust should feel present, but never loud.</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            {socialProof.map((item) => (
              <article key={item.title} className="space-y-4 border-b border-[var(--color-line)] pb-8">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{item.title}</p>
                <p className="font-display text-2xl leading-tight text-[var(--color-ink-strong)] sm:text-3xl">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-snap="true" className="snap-section snap-section-screen relative min-h-[78vh] overflow-hidden bg-[#ece2da]">
        <Image src="/site-assets/an3000.jpg" alt="Editorial bridal image for emotional brand statement." fill className="object-contain object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,12,0.14)_0%,rgba(20,15,12,0.2)_48%,rgba(20,15,12,0.38)_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl items-end px-6 py-14 sm:px-10 lg:px-16 lg:py-18">
          <h2 className="font-display max-w-2xl text-4xl font-medium leading-[1.02] text-white sm:text-5xl lg:text-6xl">Every bride remembers how she felt, not only how she looked.</h2>
        </div>
      </section>

      <section id="faq" data-snap="true" className="snap-section bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">FAQ</p>
            <h2 className="font-display text-4xl font-medium leading-[1.02] sm:text-5xl">Practical details, kept clear.</h2>
          </div>
          <div className="border-t border-[var(--color-line)]">
            {faqItems.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <article key={faq.question} className="border-b border-[var(--color-line)]">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7">
                    <span className="text-lg font-medium text-[var(--color-ink-strong)] sm:text-xl">{faq.question}</span>
                    <span className="text-2xl leading-none text-[var(--color-muted)]">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen ? <div className="max-w-xl pb-5 pr-10 text-base leading-8 text-[var(--color-muted)]">{faq.answer}</div> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
        <a href="#contact" aria-label="Open contact section" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(110,72,18,0.1)] bg-[rgba(247,240,234,0.72)] px-4 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-strong)] shadow-[0_10px_22px_rgba(35,27,24,0.06)] backdrop-blur-[8px] transition hover:bg-[rgba(247,240,234,0.84)] sm:min-h-13 sm:px-5">
          Contact
        </a>
      </div>

      <section id="contact" data-snap="true" className="snap-section bg-[var(--color-cream)] px-6 py-18 sm:px-10 lg:px-16 lg:py-22">
        <div className="mx-auto max-w-5xl border border-[rgba(255,255,255,0.08)] bg-[var(--color-ink-strong)] text-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
            <div className="space-y-5 px-8 py-8 sm:px-12 sm:py-10">
              <p className="text-sm uppercase tracking-[0.28em] text-white/56">Consultation</p>
              <h2 className="font-display max-w-lg text-4xl font-medium text-white sm:text-5xl">A considered start to your bridal journey.</h2>
              <p className="max-w-xl text-base leading-8 text-white/74 sm:text-lg">Share the styles you love, and we will guide you personally.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="text" placeholder="Your name" className="min-h-13 border border-white/18 bg-[rgba(255,255,255,0.04)] px-4 text-sm text-white placeholder:text-white/46 outline-none transition focus:border-white/32" />
                <input type="email" placeholder="Email address" className="min-h-13 border border-white/18 bg-[rgba(255,255,255,0.04)] px-4 text-sm text-white placeholder:text-white/46 outline-none transition focus:border-white/32" />
              </div>
              <textarea placeholder="Tell us which styles you love or where you would like guidance." rows={4} className="min-h-[124px] w-full resize-none border border-white/18 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm text-white placeholder:text-white/46 outline-none transition focus:border-white/32" />
              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="mailto:hello@paradress.co.uk" className="inline-flex min-h-13 items-center justify-center bg-white px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#6f4d1f] transition hover:opacity-92">
                  Book a Consultation
                </a>
                <a href="https://instagram.com/para.dress" target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center justify-center border border-white/16 px-7 py-4 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-white/8">
                  Message on Instagram
                </a>
              </div>
            </div>
            <div className="border-l-0 border-white/8 px-8 py-8 sm:px-12 sm:py-10 lg:border-l">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Craftsmanship details</p>
                  <p className="mt-3 text-base leading-7 text-white/72">Each gown is made with close attention to structure, fabric, fit, and finishing.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Client proof</p>
                  <p className="mt-3 text-base leading-7 text-white/72">Brides are guided personally, with sizing support and direct communication throughout the process.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Instagram gallery</p>
                  <p className="mt-3 text-base leading-7 text-white/72">Explore the evolving visual world of Para Dress through fittings, details, and bridal looks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer data-snap="true" className="snap-section bg-white border-t border-[var(--color-line)] px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-[1.65rem] font-medium tracking-[0.24em] text-[var(--color-ink)] sm:text-[2rem]">PARA</p>
            <p className="-mt-1 text-[0.68rem] uppercase tracking-[0.48em] text-[var(--color-muted)]">DRESS</p>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--color-muted)]">Handcrafted in Ukraine and offered directly to brides across the UK.</p>
        </div>
      </footer>
    </main>
  );
}
