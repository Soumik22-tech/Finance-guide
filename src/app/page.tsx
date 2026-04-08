import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Finance Guide — Free Budget Planner for India",
  description:
    "India's free AI-powered budget planner. Enter your salary, city, and family details to get a personalised monthly budget, AI financial advice, and a 6-month savings roadmap instantly.",
  alternates: {
    canonical: "https://finance-guide.vercel.app",
  },
  openGraph: {
    title: "Finance Guide — Free Budget Planner for India",
    description:
      "Get a personalised monthly budget based on your Indian salary in under 2 minutes. AI coach + savings roadmap included. 100% free.",
    url: "https://finance-guide.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Home() {
  return <HomeClient />;
}
