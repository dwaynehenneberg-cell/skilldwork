import SiteControls from "./site-controls";
import SiteLogo from "./site-logo";

const LOGO = {
  /** Marketing/legal top bars */
  md: { px: 72, className: "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20" },
  /** Home hero brand mark */
  lg: { px: 160, className: "h-36 w-36 sm:h-40 sm:w-40" },
} as const;

type SiteHeaderProps = {
  maxWidthClass?: string;
  logoSize?: keyof typeof LOGO;
  /** Absolute full-width bar (home). */
  floating?: boolean;
  logoHref?: string | false;
  priority?: boolean;
  className?: string;
};

/** Shared marketing header: logo + lang/theme, vertically centered. */
export default function SiteHeader({
  maxWidthClass = "max-w-3xl",
  logoSize = "md",
  floating = false,
  logoHref = "/",
  priority = false,
  className = "",
}: SiteHeaderProps) {
  const logo = LOGO[logoSize];
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
        size={logo.px}
        className={logo.className}
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
