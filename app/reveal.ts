/**
 * Entrance for a text block: it fades and rises into place. Stagger a set of them with
 * `[animation-delay:…]` or `delay-…` so they arrive in reading order.
 *
 * Above the fold use `revealOnLoad` — it runs as soon as the page paints, without waiting for
 * hydration. Further down use `revealOnView` inside a <ScrollReveal>, so a block only plays
 * once it has actually been scrolled to.
 *
 * Plain module on purpose: a server component importing these from a "use client" file would
 * get a client reference back instead of the string.
 */
export const revealOnLoad = "animate-[reveal_500ms_ease-out_both] motion-reduce:animate-none";

export const revealOnView =
  "translate-y-2 opacity-0 transition duration-500 ease-out group-data-[visible=true]:translate-y-0 group-data-[visible=true]:opacity-100 motion-reduce:transition-none";
