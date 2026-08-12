import type { Metadata } from "next";
import PricingContent from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing | Skilldwork",
  description:
    "Freelancer, Pro, and Business plans for turning services into digital workflows — plus custom solutions.",
};

export default function PricingPage() {
  return <PricingContent />;
}
