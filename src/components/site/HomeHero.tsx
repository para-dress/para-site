import Image from "next/image";

type HeroLead = {
  title: string;
  body: string;
  image: string;
  alt: string;
};

type HeroSupport = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

type HomeHeroProps = {
  lead: HeroLead;
  support: HeroSupport;
};

const primaryButtonClass =
  "inline-flex min-h-14 items-center justify-center rounded-full px-7 text-sm font-medium uppercase tracking-[0.14em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const secondaryButtonClass =
  "inline-flex min-h-14 items-center justify-center rounded-full px-7 text-sm font-medium uppercase tracking-[0.14em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function HomeHero({ lead, support }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#ece2da]">
      <div className="relative min-h-[var(--hero-min-height)]">
        <Image
          src={lead.image}
          alt={lead.alt}
          fill
          priority
          className="object-cover object-[center_20%] sm:object-[center_24%] lg:object-[center_18%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.14)_0%,rgba(247,240,234,0.08)_26%,rgba(24,18,14,0.18)_56%,rgba(24,18,14,0.52)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(247,240,234,0.4)_0%,rgba(247,240,234,0)_100%)] sm:h-40" />

        <div className="relative z-10 mx-auto flex min-h-[var(--hero-min-height)] max-w-[var(--site-max-width)] items-end px-[var(--site-gutter)] pb-8 pt-28 sm:pb-10 sm:pt-36 lg:items-center lg:pb-0 lg:pt-32">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-end lg:gap-10 xl:grid-cols-[minmax(0,1fr)_25rem]">
            <div className="max-w-[40rem] space-y-5 sm:space-y-6">
              <p className="text-[0.72rem] uppercase tracking-[0.34em] text-white/78 sm:text-[0.76rem]">
                Para Dress
              </p>
              <h1 className="font-display text-[var(--hero-title-size)] font-medium leading-[0.92] text-white text-balance">
                {lead.title}
              </h1>
              <p className="max-w-[32rem] text-[var(--hero-body-size)] leading-[1.8] text-white/84 sm:leading-[1.85] text-pretty">
                {lead.body}
              </p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap lg:pt-3">
                <a
                  href="#collections"
                  className={`${primaryButtonClass} bg-white text-[var(--color-ink-strong)] hover:bg-[rgba(255,255,255,0.92)]`}
                >
                  Explore Collection
                </a>
                <a
                  href="#contact"
                  className={`${secondaryButtonClass} border border-white/22 bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]`}
                >
                  Book Consultation
                </a>
              </div>
            </div>

            <article className="max-w-[25rem] self-end rounded-[1.75rem] border border-white/16 bg-[rgba(28,21,17,0.3)] p-4 shadow-[0_24px_60px_rgba(18,13,10,0.16)] backdrop-blur-[10px] sm:max-w-[27rem] sm:p-5 lg:mb-8 lg:justify-self-end">
              <div className="grid gap-4 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:items-start lg:grid-cols-1 xl:grid-cols-[7rem_minmax(0,1fr)]">
                <div className="relative aspect-[0.8/1] overflow-hidden rounded-[1.2rem] bg-[#eadfd7]">
                  <Image
                    src={support.image}
                    alt={support.alt}
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="(max-width: 1023px) 40vw, 18vw"
                  />
                </div>
                <div className="space-y-3 sm:space-y-2 lg:space-y-3">
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/62">
                    {support.eyebrow}
                  </p>
                  <h2 className="font-display text-[1.65rem] leading-[0.98] text-white sm:text-[1.82rem] lg:text-[1.95rem] text-balance">
                    {support.title}
                  </h2>
                  <p className="max-w-[18rem] text-[0.95rem] leading-7 text-white/72 text-pretty">
                    {support.body}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
