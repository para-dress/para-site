import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | Para Dress",
  description:
    "Read how Para Dress collects, uses, and protects personal data for website enquiries, communications, and analytics.",
};

const policySections = [
  {
    title: "1. Who we are",
    body: [
      "Para Dress is a bridal brand serving brides across the UK through paradress.co.uk.",
      "Contact email: hello@paradress.co.uk",
      "Privacy contact: privacy@paradress.co.uk",
      "If you have any questions about this Privacy Policy or how we use your personal data, please contact us using the details above.",
    ],
  },
  {
    title: "2. What personal data we collect",
    body: [
      "We may collect your name, email address, phone number, WhatsApp or Instagram contact details, and any information you provide in an enquiry form or message.",
      "We may also collect wedding-related details you choose to share, such as dress preferences, sizing needs, wedding date, timeline, and other order-related preferences.",
      "Technical information such as IP address, browser type, device information, visited pages, and cookie or analytics data may also be collected when you use the website.",
    ],
  },
  {
    title: "3. How we collect your data",
    body: [
      "We collect personal data when you fill in a contact or enquiry form, contact us by email, message us via Instagram or WhatsApp, browse our website, or accept cookies or analytics tracking where applicable.",
    ],
  },
  {
    title: "4. How we use your personal data",
    body: [
      "We use personal data to respond to enquiries, communicate with you about our dresses and services, help with style and sizing guidance, manage customer communication and potential orders, provide support, improve our website and customer experience, understand website usage through analytics, protect the website from misuse or fraud, and comply with legal obligations.",
      "We do not sell your personal data.",
    ],
  },
  {
    title: "5. Our lawful bases for processing",
    body: [
      "Depending on the situation, we rely on legitimate interests, contract, consent, and legal obligation under UK data protection law.",
      "Legitimate interests apply to replying to enquiries, managing communication, improving our services, and operating the website effectively.",
      "Contract applies where processing is necessary to take steps before entering into a contract with you or to fulfil an order.",
      "Consent applies where required for optional cookies, analytics tools, or marketing communications.",
      "Legal obligation applies where we must keep records or process data to comply with the law.",
    ],
  },
  {
    title: "6. Cookies and analytics",
    body: [
      "Our website may use cookies and similar technologies to improve performance and understand how visitors use the site.",
      "We use Google Analytics to understand website traffic and usage patterns. This may include IP address, device and browser information, pages viewed, time spent on pages, referral source, and general location data.",
      "Where required by law, we will ask for your consent before placing non-essential cookies on your device. You can also control cookies through your browser settings.",
    ],
  },
  {
    title: "7. Sharing your personal data",
    body: [
      "We may share your personal data with trusted third-party providers where necessary to operate the website and business, including hosting and infrastructure providers, analytics providers such as Google Analytics, email providers, contact form or CRM tools, communication platforms such as Instagram or WhatsApp where you choose to contact us through them, and advertising or remarketing platforms if used in future.",
      "We require third-party providers to handle personal data appropriately and securely.",
    ],
  },
  {
    title: "8. International transfers",
    body: [
      "Some third-party providers may process or store personal data outside the United Kingdom. Where this happens, we take reasonable steps to ensure appropriate safeguards are in place so your personal data remains protected in accordance with UK data protection law.",
    ],
  },
  {
    title: "9. How long we keep your data",
    body: [
      "We keep personal data only for as long as reasonably necessary for the purposes described in this Privacy Policy, including responding to enquiries, managing customer relationships, keeping business records, and meeting legal obligations.",
      "As a general guide, enquiry data may be kept for up to 12 months. Customer and order-related information may be kept longer where reasonably necessary for business, legal, tax, or accounting purposes. Analytics data is retained in line with the settings of the analytics provider.",
    ],
  },
  {
    title: "10. Your rights",
    body: [
      "Under UK data protection law, you may have the right to request access to your personal data, request correction of inaccurate or incomplete data, request deletion of your data, object to certain types of processing, request restriction of processing, withdraw consent where processing is based on consent, request transfer of your data in certain circumstances, and make a complaint to the UK Information Commissioner’s Office (ICO).",
      "To exercise any of these rights, please contact privacy@paradress.co.uk.",
      "You can also complain to the ICO at https://ico.org.uk.",
    ],
  },
  {
    title: "11. Data security",
    body: [
      "We take reasonable technical and organisational measures to protect personal data against unauthorised access, loss, misuse, disclosure, or alteration. However, no internet transmission or electronic storage method is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    title: "12. Third-party links",
    body: [
      "Our website may contain links to third-party websites or platforms, including Instagram and other social media platforms. If you follow those links, please note that those websites have their own privacy policies and we are not responsible for their privacy practices.",
    ],
  },
  {
    title: "13. Changes to this Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect legal, technical, or business changes. Any updates will be posted on this page with a revised ‘Last updated’ date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Privacy Policy"
        title="How we handle your information at Para Dress"
        body="This page explains what personal data we collect, how we use it, and what rights you have when you contact us or use paradress.co.uk."
      />

      <section className="bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-cream)]/45 p-8 shadow-[0_18px_60px_rgba(40,28,16,0.04)] sm:p-10 lg:p-12">
          <div className="space-y-3 border-b border-[var(--color-line)] pb-8">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Last updated: 5 July 2026
            </p>
            <p className="max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              At <span className="font-medium text-[var(--color-ink-strong)]">Para Dress</span> (“we”, “us”, “our”), we respect your privacy and are committed to protecting your personal data.
            </p>
          </div>

          <div className="space-y-8 pt-8">
            {policySections.map((section) => (
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
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-white/55">Privacy contact</p>
            <p className="mt-2 text-base leading-7 text-white/76 sm:text-lg">
              For privacy-related questions or data requests, email privacy@paradress.co.uk.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-cream)] px-6 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-strong)] transition hover:bg-white"
          >
            Contact Para Dress
          </Link>
        </div>
      </section>
    </main>
  );
}
