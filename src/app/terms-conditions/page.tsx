import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions | Para Dress",
  description:
    "Read the Para Dress website and order terms, including deposits, sizing, timelines, payments, and returns.",
};

const termsSections = [
  {
    title: "1. About these Terms",
    body: [
      "These Terms & Conditions apply to your use of paradress.co.uk and to enquiries, reservations, and orders placed with Para Dress unless different written terms are agreed with you directly.",
      "By using this website or placing an order, you agree to these terms. Nothing in these terms is intended to affect any rights you may have under applicable consumer law.",
    ],
  },
  {
    title: "2. About Para Dress",
    body: [
      "Para Dress offers bridal dresses made in Ukraine and supplied directly to brides in the UK through a more personal, atelier-led process.",
      "For questions about these terms, please contact hello@paradress.co.uk.",
    ],
  },
  {
    title: "3. Product information and availability",
    body: [
      "We aim to ensure that product descriptions, imagery, pricing, and availability are presented as accurately as possible. However, some details may change over time and not every style may be available at all times.",
      "Images are provided for guidance. Minor differences in colour, finish, embellishment placement, or fabric appearance may occur due to photography, screens, material batches, or hand-finished production.",
    ],
  },
  {
    title: "4. Enquiries, consultations, and order acceptance",
    body: [
      "Submitting an enquiry through the website or by message does not create a binding order. Orders are only confirmed once style details, pricing, sizing route, and timing have been agreed and we confirm acceptance with you directly.",
      "We reserve the right to decline an order request where timing, availability, sizing information, or other practical requirements cannot be met responsibly.",
    ],
  },
  {
    title: "5. Pricing and deposit",
    body: [
      "Prices may vary by style. As a general guide, most Para Dress gowns are priced between £699 and £950 depending on the model.",
      "A 50% deposit is required before production begins. Production will not start until the deposit has been received and key order details have been confirmed.",
      "Any delivery fees, special requests, or agreed extras will be clarified with you before the order is finalised.",
    ],
  },
  {
    title: "6. Custom sizing and standard sizing",
    body: [
      "Custom sizing is available for an additional £100 unless otherwise stated. Standard-size orders are prepared according to the selected size rather than custom measurements.",
      "We will guide you through the sizing route that is most suitable for your order, but the final choice and the accuracy of information provided remain important to the outcome.",
    ],
  },
  {
    title: "7. Measurements and fit responsibility",
    body: [
      "Where custom sizing is selected, the bride is responsible for providing accurate measurements unless another arrangement is expressly agreed in writing. We may provide guidance on how to take measurements, but we are not responsible for errors in measurements supplied by the customer or a third party on the customer’s behalf.",
      "Bridal garments may still require local alterations for a personal final fit, even where a dress has been produced to the measurements provided.",
    ],
  },
  {
    title: "8. Production timelines",
    body: [
      "Standard-size production may take up to 50 days. Custom-size production may take up to 60 days. These timelines are estimates and may vary depending on style complexity, season, production scheduling, fabric availability, and communication timing.",
      "We will communicate as clearly as possible if a timing issue arises, but we are not liable for delays caused by incomplete customer information, approval delays, courier disruption, customs issues, force majeure events, or other circumstances outside our reasonable control.",
    ],
  },
  {
    title: "9. Final payment and dispatch",
    body: [
      "The remaining balance must be paid before dispatch unless a different written arrangement has been agreed. We may request final confirmation of delivery details before shipment.",
      "Ownership of the dress transfers when full payment has been received, and risk passes on delivery unless applicable law states otherwise.",
    ],
  },
  {
    title: "10. Returns, exchanges, and cancellations",
    body: [
      "Custom-sized dresses are non-returnable because they are made specifically to the bride’s measurements and order details.",
      "Standard-size dresses are prepared with care for each bride, and exchanges or replacements are not provided after shipment.",
      "If you need to discuss a problem with your order, please contact us promptly at hello@paradress.co.uk so we can review the situation. Nothing in this section limits any non-excludable statutory rights you may have under consumer law.",
    ],
  },
  {
    title: "11. Website use",
    body: [
      "You agree not to misuse this website, interfere with its operation, attempt unauthorised access, or use its content for unlawful purposes.",
      "We may suspend, withdraw, or update the website or parts of it where reasonably necessary.",
    ],
  },
  {
    title: "12. Intellectual property",
    body: [
      "All website content, including text, branding, imagery, graphics, and layout, belongs to Para Dress or is used with permission. You may not copy, reproduce, republish, or commercially exploit this content without prior written permission.",
    ],
  },
  {
    title: "13. Privacy and cookies",
    body: [
      "Our use of personal data is described in our Privacy Policy. Where cookies or analytics tools are used, they are handled in line with the choices you make through our cookie settings.",
    ],
  },
  {
    title: "14. Changes to these Terms",
    body: [
      "We may update these Terms & Conditions from time to time to reflect legal, operational, or business changes. The latest version will always appear on this page with the updated date shown below.",
    ],
  },
];

export default function TermsConditionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Terms & Conditions"
        title="The key terms for using the site and ordering with Para Dress"
        body="These terms explain how enquiries, orders, sizing, payments, timelines, and returns are handled for Para Dress."
      />

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-cream)]/45 p-8 shadow-[0_18px_60px_rgba(40,28,16,0.04)] sm:p-10 lg:p-12">
          <div className="space-y-3 border-b border-[var(--color-line)] pb-8">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Last updated: 5 July 2026
            </p>
            <p className="max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Please read these Terms & Conditions carefully before placing an order or relying on website information.
            </p>
          </div>

          <div className="space-y-8 pt-8">
            {termsSections.map((section) => (
              <section key={section.title} className="space-y-4 border-b border-[var(--color-line)] pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-display text-3xl leading-tight text-[var(--color-ink-strong)] sm:text-[2.2rem]">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-8 text-[var(--color-muted)] sm:text-[1.02rem]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-[1.75rem] border border-[rgba(111,77,31,0.1)] bg-[var(--color-ink-strong)] px-6 py-7 text-white shadow-[0_20px_60px_rgba(37,25,15,0.12)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/55">Need clarification?</p>
            <p className="mt-2 text-base leading-7 text-white/76 sm:text-lg">
              If you want to confirm order details or timing before moving ahead, contact us directly.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-cream)] px-6 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#6b4a16] shadow-[0_8px_24px_rgba(18,12,8,0.12)] transition hover:bg-white hover:text-[#5a3d12]"
          >
            Contact Para Dress
          </Link>
        </div>
      </section>
    </main>
  );
}
