import { PageHero } from "@/components/site/PageHero";

const details = [
  {
    title: "Production timeline",
    body: "Standard sizing takes up to 50 days. Custom sizing can take up to 60 days.",
  },
  {
    title: "Deposit",
    body: "Orders begin with a 50% deposit once the style, size direction, and details are confirmed.",
  },
  {
    title: "Returns & exchanges",
    body: "Custom-sized gowns are non-returnable. Standard-size dresses cannot be exchanged or replaced after shipment.",
  },
];

export default function DeliveryReturnsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Delivery & Returns"
        title="Clear expectations, handled with care."
        body="We believe luxury should also feel transparent, especially when it comes to timing, deposits, and ordering terms."
      />

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-6">
          {details.map((item) => (
            <div key={item.title} className="border-b border-[var(--color-line)] pb-6 last:border-b-0 last:pb-0">
              <h2 className="font-display text-3xl text-[var(--color-ink-strong)] sm:text-4xl">{item.title}</h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
