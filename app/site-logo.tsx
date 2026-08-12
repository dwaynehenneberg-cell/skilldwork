import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  /** Destination for the logo link. Pass `false` to render without a link. */
  href?: string | false;
  size?: number;
  className?: string;
  priority?: boolean;
  /** Empty string marks the mark as decorative (e.g. beside a text label). */
  alt?: string;
};

export default function SiteLogo({
  href = "/",
  size = 40,
  className = "",
  priority = false,
  alt = "skilldwork",
}: SiteLogoProps) {
  const decorative = alt === "";
  const images = (
    <>
      <Image
        src="/logo-light.png"
        alt={alt}
        width={size}
        height={size}
        className={[className, "dark:hidden"].filter(Boolean).join(" ")}
        priority={priority}
      />
      <Image
        src="/logo.png"
        alt={alt}
        width={size}
        height={size}
        className={[className, "hidden dark:block"].filter(Boolean).join(" ")}
        priority={priority}
      />
    </>
  );

  if (href === false) {
    return (
      <span
        className="inline-flex shrink-0"
        aria-hidden={decorative || undefined}
      >
        {images}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 transition-opacity hover:opacity-65"
      aria-label={decorative ? "skilldwork" : undefined}
    >
      {images}
    </Link>
  );
}
