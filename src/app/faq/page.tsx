import { PageHero } from "@/components/site/PageHero";

const faqItems = [
  {
    question: "What is the price range?",
    answer: "Most Para Dress styles are priced between £699 and £950 depending on the model.",
  },
  {
    question: "Do you offer custom sizing?",
    answer: "Yes. Custom sizing is available for an additional £100.",
  },
  {
    question: "How long does production take?",
    answer: "Up to 50 days for standard sizing and up to 60 days for custom sizing.",
  },
  {
    question: "How does ordering work?",
    answer: "We guide you through style choice, sizing, and measurements personally before production begins.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title="The practical details, kept clear and supportive."
        body="If you are ordering a wedding dress online, reassurance matters. Here are the answers brides ask for most often."
      />

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl border-t border-[var(--color-line)]">
          {faqItems.map((item) => (
            <div key={item.question} className="border-b border-[var(--color-line)] py-6 sm:py-7">
              <h2 className="pr-6 text-lg font-medium text-[var(--color-ink-strong)] sm:text-xl">{item.question}</h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--color-muted)]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
