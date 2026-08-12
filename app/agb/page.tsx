import type { Metadata } from "next";
import AgbContent from "./agb-content";

export const metadata: Metadata = {
  title: "Terms of Service | Skilldwork",
  description:
    "Terms of Service for the Skilldwork platform, including waitlist onboarding and subscriptions via Stripe.",
};

export default function AgbPage() {
  return <AgbContent />;
}
