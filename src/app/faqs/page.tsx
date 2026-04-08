import type { Metadata } from "next";
import FAQsClient from "./FAQsClient";

export const metadata: Metadata = {
  title: "FAQs — Finance Guide Budget Planner India",
  description:
    "Frequently asked questions about Finance Guide — India's free AI budget planner. Learn about data privacy, AI features, budget accuracy, PDF export, and more.",
  keywords: [
    "finance guide FAQ",
    "budget planner India questions",
    "is finance guide free",
    "AI budget calculator India",
    "budget planner privacy India",
  ],
  alternates: {
    canonical: "https://finance-guide.vercel.app/faqs",
  },
  openGraph: {
    title: "FAQs — Finance Guide Budget Planner India",
    description:
      "Everything you need to know about Finance Guide — India's free AI-powered budget calculator.",
    url: "https://finance-guide.vercel.app/faqs",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function FAQsPage() {
  return <FAQsClient />;
}
