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
  "inline-flex min-h-13 sm:min-h-14 items-center justify-center rounded-full px-6 sm:px-7 text-[0.82rem] sm:text-sm font-medium uppercase tracking-[0.14em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const secondaryButtonClass =
  "inline-flex min-h-13 sm:min-h-14 items-center justify-center rounded-full px-6 sm:px-7 text-[0.82rem] sm:text-sm font-medium uppercase tracking-[0.14em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function HomeHero({ lead, support }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#ece2da]">
      <div className="relative min-h-[var(--hero-min-height)]">
        <Image
          src={lead.image}
          alt={lead.alt}
          fill
          priority
          className="object-cover object-[center_24%] sm:object-[center_24%] lg:object-[center_18%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,240,234,0.2)_0%,rgba(247,240,234,0.08)_18%,rgba(24,18,14,0.22)_50%,rgba(24,18,14,0.58)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(247,240,234,0.4)_0%,rgba(247,240,234,0)_100%)] sm:h-40" />

        <div className="relative z-10 mx-auto flex min-h-[var(--hero-min-height)] max-w-[var(--site-max-width)] items-end px-[var(--site-gutter)] pb-6 pt-24 sm:pb-10 sm:pt-36 lg:items-center lg:pb-0 lg:pt-32">
          <div className="grid w-full gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-end lg:gap-10 xl:grid-cols-[minmax(0,1fr)_25rem]">
            <div className="max-w-[37rem] space-y-4 sm:space-y-6">
              <p className="hidden text-[0.72rem] uppercase tracking-[0.34em] text-white/78 sm:block sm:text-[0.76rem]">
                Para Dress
              </p>
              <div className="max-w-[18rem] sm:max-w-none">
                <h1 className="font-display max-w-[15rem] sm:max-w-[24rem] lg:max-w-none text-[var(--hero-title-size)] font-medium leading-[0.94] text-white text-balance">
                  {lead.title}
                </h1>
                <p className="mt-3 max-w-[15.5rem] sm:max-w-[24rem] lg:max-w-[32rem] text-[var(--hero-body-size)] leading-[1.6] text-white/84 sm:leading-[1.85] text-pretty">
                  {lead.body}
                </p>
                <div className="mt-5 flex flex-col gap-2.5 sm:mt-0 sm:pt-2 lg:pt-3">
                  <a
                    href="#collections"
                    className={`${primaryButtonClass} w-full sm:w-auto bg-white text-[var(--color-ink-strong)] shadow-[0_10px_30px_rgba(20,14,11,0.12)] hover:bg-[rgba(255,255,255,0.92)]`}
                  >
                    Explore Collection
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-start text-[0.82rem] font-medium uppercase tracking-[0.16em] text-white/84 transition hover:text-white sm:hidden"
                  >
                    Book Consultation
                  </a>
                  <a
                    href="#contact"
                    className={`${secondaryButtonClass} hidden sm:inline-flex sm:w-auto border border-white/38 bg-[rgba(255,255,255,0.14)] text-white hover:bg-[rgba(255,255,255,0.2)]`}
                  >
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>

            <article className="hidden max-w-[25rem] self-end rounded-[1.5rem] border border-white/16 bg-[rgba(28,21,17,0.22)] p-3.5 shadow-[0_18px_44px_rgba(18,13,10,0.14)] backdrop-blur-[10px] sm:block sm:max-w-[27rem] sm:rounded-[1.75rem] sm:bg-[rgba(28,21,17,0.3)] sm:p-5 lg:mb-8 lg:justify-self-end">
              <div className="grid gap-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:items-start lg:grid-cols-1 xl:grid-cols-[7rem_minmax(0,1fr)]">
                <div className="relative hidden aspect-[0.8/1] overflow-hidden rounded-[1.2rem] bg-[#eadfd7] sm:block">
                  <Image
                    src={support.image}
                    alt={support.alt}
                    fill
                    className="object-cover object-[center_18%]"
                    sizes="(max-width: 1023px) 40vw, 18vw"
                  />
                </div>
                <div className="space-y-2 sm:space-y-2 lg:space-y-3">
                  <p className="text-[0.64rem] uppercase tracking-[0.28em] text-white/62 sm:text-[0.68rem] sm:tracking-[0.3em]">
                    {support.eyebrow}
                  </p>
                  <h2 className="font-display max-w-[16rem] sm:max-w-none text-[1.28rem] leading-[1.02] text-white sm:text-[1.82rem] lg:text-[1.95rem] text-balance">
                    {support.title}
                  </h2>
                  <p className="hidden max-w-[18rem] text-[0.95rem] leading-7 text-white/72 text-pretty sm:block">
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
