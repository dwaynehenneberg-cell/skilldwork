import type { Metadata } from "next";
import PrivacyContent from "./privacy-content";

export const metadata: Metadata = {
  title: "Privacy | Skilldwork",
  description: "Privacy notice for Skilldwork contact requests and bookings.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
