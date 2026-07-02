import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";

const contactNotes = [
  "Share the styles you love and the wedding timing you are working toward.",
  "We will guide you on sizing, measurements, and which silhouettes may suit you best.",
  "Custom sizing is available for +£100, with production up to 60 days.",
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Begin with a private conversation."
        body="Whether you already have a dress in mind or want calmer guidance first, Para Dress is here to help you move forward with clarity."
      />

      <section className="bg-[var(--color-cream)] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[rgba(111,77,31,0.1)] bg-[var(--color-ink-strong)] text-white shadow-[0_24px_80px_rgba(43,29,16,0.12)]">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-6 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
              <h2 className="font-display text-4xl leading-[1.02] sm:text-5xl">Request a consultation</h2>
              <p className="max-w-2xl text-base leading-8 text-white/76 sm:text-lg">Tell us what kind of gown you are looking for, and we will reply with personal guidance.</p>
              <ContactForm />
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-4 text-white/46">
                  <span className="h-px flex-1 bg-white/12" />
                  <span className="text-[0.72rem] uppercase tracking-[0.24em]">Or</span>
                  <span className="h-px flex-1 bg-white/12" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href="mailto:hello@paradress.co.uk?subject=Para%20Dress%20Consultation" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/20 bg-white/6 px-7 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
                    Email us
                  </a>
                  <a href="https://instagram.com/para.dress" target="_blank" rel="noreferrer" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/20 bg-white/6 px-7 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-white/10">
                    Message us on Instagram
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-8 sm:px-10 sm:py-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
              <div className="space-y-5">
                {contactNotes.map((note, index) => (
                  <div key={note} className="rounded-[1.35rem] border border-white/10 bg-white/6 p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/52">Step {index + 1}</p>
                    <p className="mt-3 text-base leading-7 text-white/76">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
