type HeaderLogoProps = {
  isScrolled: boolean;
};

export function HeaderLogo({ isScrolled }: HeaderLogoProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "px-4 py-3 sm:px-6 lg:px-8"
          : "px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7 xl:px-14"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[var(--site-max-width)] items-center justify-center rounded-full border border-white/14 text-center backdrop-blur-md transition-all duration-500 ${
          isScrolled
            ? "bg-[rgba(247,240,234,0.82)] shadow-[0_14px_40px_rgba(34,24,18,0.08)]"
            : "bg-[rgba(247,240,234,0.22)]"
        }`}
      >
        <div className="px-6 py-3 sm:px-8 lg:px-10">
          <p className="font-display text-[1.75rem] font-medium tracking-[0.32em] text-[var(--color-ink)] sm:text-[2.2rem] lg:text-[2.45rem]">
            PARA
          </p>
          <p className="-mt-1 text-[0.62rem] uppercase tracking-[0.52em] text-[var(--color-muted)] sm:text-[0.72rem] lg:text-[0.74rem]">
            DRESS
          </p>
        </div>
      </div>
    </header>
  );
}
