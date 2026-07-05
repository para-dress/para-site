import { PageHero } from "@/components/site/PageHero";

const faqItems = [
  {
    question: "What is the price range?",
    answer: "Most Para Dress styles are priced between £699 and £950 depending on the model.",
  },
  {
    question: "Do you offer custom sizing?",
    answer: "Yes. Custom sizing is available for +£100.",
  },
  {
    question: "How long does production take?",
    answer: "From 21 working days up to 50 working days for standard sizing, and from 21 working days up to 60 working days for custom sizing (depending on current production workload).",
  },
  {
    question: "What deposit is required?",
    answer: "A 50% deposit is required to begin production once your style, sizing direction, and details are confirmed.",
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
    answer: "We guide each bride through sizing and measurements personally before production begins.",
  },
  {
    question: "How does ordering work?",
    answer: "Choose the styles you love, send us your enquiry, and we will guide you on sizing, measurements, timing, and the next steps before your order begins.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title="The details brides usually want to know first."
        body="Ordering a wedding dress online should feel clear and reassuring. Here are the answers to the questions we hear most often."
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
