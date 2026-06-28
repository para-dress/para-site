export default function Home() {
  const collections = [
    {
      name: "Signature Collection",
      description:
        "Clean silhouettes, refined structure, and modern bridal styling designed to feel premium without feeling overdone.",
    },
    {
      name: "Romantic Collection",
      description:
        "Soft details, fluid lines, and feminine shapes for brides who want elegance with a little more softness.",
    },
  ];

  const steps = [
    "Choose your favourite dress and enquire for availability.",
    "We guide you through sizing and whether standard or custom fit is best.",
    "Your order starts with a 50% deposit.",
    "Production takes up to 50 days for standard sizing or up to 60 days for custom sizing.",
  ];

  const faqs = [
    {
      question: "What is the price range?",
      answer:
        "Most dresses are priced between £699 and £950 depending on the model.",
    },
    {
      question: "Do you offer custom sizing?",
      answer:
        "Yes. Custom sizing is available for an additional £100.",
    },
    {
      question: "How long does production take?",
      answer:
        "Up to 50 days for standard sizes and up to 60 days for custom sizing.",
    },
    {
      question: "Can I return a custom-sized dress?",
      answer:
        "No. Custom-sized dresses are made specifically to your measurements and are non-returnable.",
    },
  ];

  return (
    <main className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      <section className="border-b border-black/5 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Para Dress | UK Bridal
            </p>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
                Modern wedding dresses with a premium, feminine feel.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
                Para Dress brings elegant bridal design to UK brides with refined silhouettes,
                custom sizing options, and a made-to-order process that feels personal from the first message.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://instagram.com/para.dress"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-ink)] px-7 py-4 text-sm font-medium text-white transition hover:opacity-90"
              >
                View on Instagram
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] px-7 py-4 text-sm font-medium transition hover:bg-white/60"
              >
                Make an Enquiry
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-8 shadow-[0_20px_60px_rgba(33,25,22,0.06)] sm:p-10">
            <div className="space-y-6">
              <div className="h-80 rounded-[1.5rem] bg-[linear-gradient(135deg,#f5ede8_0%,#e8d9d1_45%,#d8c1b4_100%)]" />
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Designed for calm luxury
                </p>
                <p className="text-base leading-7 text-[var(--color-muted)]">
                  Premium bridal presentation, made for trust-building, enquiries, and a polished first impression before the full catalogue goes live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--color-muted)]">
              About the brand
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">A bridal brand built around elegance, clarity, and confidence.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[var(--color-muted)]">
            <p>
              Our dresses are produced in Ukraine and selected for brides who want beautiful design without the noise of a crowded catalogue experience.
            </p>
            <p>
              We focus on premium presentation, direct support, and a process that helps each bride feel informed before she orders.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Collections
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Two curated directions, one premium bridal point of view.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {collections.map((collection) => (
              <article
                key={collection.name}
                className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-rose)] p-8"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">{collection.name}</h3>
                  <p className="text-base leading-7 text-[var(--color-muted)]">{collection.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--color-muted)]">
              How to order
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">A simple made-to-order process with clear expectations.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.75rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_12px_35px_rgba(33,25,22,0.04)]"
              >
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Step {index + 1}
                </p>
                <p className="text-base leading-7">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white px-6 py-18 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--color-muted)]">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">The details brides usually ask first.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-[1.75rem] border border-[var(--color-line)] p-6">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 text-base leading-7 text-[var(--color-muted)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-ink)] px-8 py-12 text-white sm:px-12">
          <div className="space-y-6 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">Contact</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Ready to find your dress?</h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Message Para Dress on Instagram to ask about available styles, pricing, sizing, and next steps. We will guide you through the process personally.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://instagram.com/para.dress"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-medium text-[var(--color-ink)] transition hover:opacity-90"
              >
                Open Instagram
              </a>
              <span className="text-sm uppercase tracking-[0.18em] text-white/60">@para.dress</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
