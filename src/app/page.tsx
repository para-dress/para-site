import Image from "next/image";

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

const featuredLooks = [
  {
    name: "AN 3000",
    mood: "Clean luxury",
    image: "/site-assets/an3000.jpg",
    alt: "Elegant clean bridal gown photographed in a studio archway.",
  },
  {
    name: "AN 2211",
    mood: "Modern femininity",
    image: "/site-assets/an2211.jpg",
    alt: "Modern bridal gown with a soft structured silhouette.",
  },
  {
    name: "AN 3003",
    mood: "Romantic statement",
    image: "/site-assets/an3003.jpg",
    alt: "Romantic statement wedding dress with dramatic volume.",
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
  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-6 py-5 sm:px-10 lg:px-16">
        <div className="text-center opacity-78">
          <p className="font-display text-[2.2rem] font-medium tracking-[0.34em] text-[var(--color-ink)] sm:text-[3rem]">
            PARA
          </p>
          <p className="-mt-1 text-[0.72rem] uppercase tracking-[0.55em] text-[var(--color-muted)] sm:text-[0.82rem]">
            DRESS
          </p>
        </div>
      </header>

      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/site-assets/an3000.jpg"
          alt="Hero bridal look for Para Dress homepage"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.02)_0%,rgba(247,240,234,0.06)_38%,rgba(247,240,234,0.34)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-12 pt-32 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20 lg:pt-36">
          <div className="max-w-xl rounded-[1.75rem] border border-white/14 bg-[rgba(247,240,234,0.14)] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[rgba(157,122,63,0.82)]">Featured bridal look</p>
            <p className="font-display mt-3 text-3xl font-medium leading-tight text-[rgba(157,122,63,0.82)] sm:text-4xl">
              Minimal elegance with a fashion-led edge.
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(122,98,63,0.86)] sm:text-base">
              A calm first impression, chosen to set the tone for the collection and build trust from the first screen.
            </p>
          </div>
        </div>
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

      <section className="border-y border-black/5 bg-white px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Selected looks</p>
              <h2 className="font-display text-4xl font-medium sm:text-5xl">A first impression of the styles shaping the collection.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[var(--color-muted)]">
              We are curating a bridal wardrobe that moves between clean modern silhouettes and softer, more romantic statement looks.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
            {featuredLooks.map((look, index) => (
              <article
                key={look.name}
                className={`overflow-hidden rounded-[2rem] border border-[var(--color-line)] ${
                  index === 0 ? "bg-[var(--color-rose)]" : "bg-[var(--color-blush)]"
                }`}
              >
                <div className={`relative w-full ${index === 0 ? "h-[26rem]" : "h-80"}`}>
                  <Image
                    src={look.image}
                    alt={look.alt}
                    fill
                    className="object-cover object-center"
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 42vw" : "(max-width: 1024px) 100vw, 28vw"}
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{look.mood}</p>
                  <h3 className="font-display text-3xl font-medium">{look.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="collections" className="px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-muted)]">Collections</p>
            <h2 className="font-display max-w-3xl text-4xl font-medium sm:text-5xl">
              Two distinct directions, one consistent bridal point of view.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {collections.map((collection) => (
              <article key={collection.name} className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white">
                <div className="relative h-96 w-full">
                  <Image
                    src={collection.image}
                    alt={collection.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="space-y-4 p-8">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">{collection.accent}</p>
                  <h3 className="font-display text-3xl font-medium">{collection.name}</h3>
                  <p className="text-base leading-7 text-[var(--color-muted)]">{collection.description}</p>
                  <a href="#contact" className="inline-flex text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-ink)]">
                    Enquire about this direction
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
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
            <div className="relative min-h-[320px] overflow-hidden">
              <Image
                src="/site-assets/an3001.jpg"
                alt="Romantic bridal look used in the contact section"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,7,0.1)_0%,rgba(12,8,7,0.5)_100%)]" />
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
