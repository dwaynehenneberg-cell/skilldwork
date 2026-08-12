import SiteControls from "./site-controls";
import SiteLogo from "./site-logo";

/** One mark size for every marketing header (home, pricing, legal, …). */
const LOGO = {
  px: 72,
  className: "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20",
} as const;

type SiteHeaderProps = {
  maxWidthClass?: string;
  /** Absolute full-width bar (home). */
  floating?: boolean;
  logoHref?: string | false;
  priority?: boolean;
  className?: string;
};

/** Shared marketing header: logo + lang/theme, vertically centered. */
export default function SiteHeader({
  maxWidthClass = "max-w-3xl",
  floating = false,
  logoHref = "/",
  priority = false,
  className = "",
}: SiteHeaderProps) {
  const row = (
    <div
      className={[
        "flex w-full items-center justify-between gap-3",
        floating
          ? "px-4 py-4 sm:px-10 sm:py-8"
          : `mx-auto ${maxWidthClass} pb-8 sm:pb-10`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SiteLogo
        href={logoHref}
        size={LOGO.px}
        className={LOGO.className}
        priority={priority}
      />
      <SiteControls />
    </div>
  );

  if (floating) {
    return <header className="absolute inset-x-0 top-0 z-10">{row}</header>;
  }

  return <header className="mx-auto w-full">{row}</header>;
}
