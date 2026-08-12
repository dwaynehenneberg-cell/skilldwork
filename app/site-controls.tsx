"use client";

import LangSwitch from "./lang-switch";
import ThemeToggle from "./theme-toggle";

/** Language + theme controls for marketing/legal headers. */
export default function SiteControls({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <LangSwitch />
      <ThemeToggle />
    </div>
  );
}
