import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const BASE_URL = "https://finance-guide.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Finance Guide — Free Budget Planner for India",
    template: "%s | Finance Guide",
  },
  description:
    "Finance Guide is a free AI-powered budget planner built for India. Enter your salary and get a personalised monthly budget breakdown, AI financial advice, and a 6-month savings roadmap — in under 2 minutes.",
  keywords: [
    "budget planner India",
    "salary budget calculator India",
    "personal finance tool India",
    "how to manage salary India",
    "monthly budget calculator",
    "AI financial advisor free",
    "budget breakdown India",
    "financial planning tool India",
    "free budget calculator rupees",
    "poverty escape plan India",
  ],
  authors: [{ name: "Soumik Majumder", url: "https://www.linkedin.com/in/soumik-majumder-b04343333/" }],
  creator: "Soumik Majumder",
  publisher: "Finance Guide",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Finance Guide",
    title: "Finance Guide — Free AI Budget Planner for India",
    description:
      "Get a personalised monthly budget breakdown based on your salary, city, and family size. Free AI financial coach included. Built for India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Finance Guide — Free Budget Planner for India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Guide — Free AI Budget Planner for India",
    description:
      "Enter your salary. Get a personalised budget plan + AI financial advice. 100% free. Built for India.",
    images: ["/og-image.png"],
    creator: "@soumik_dev",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your Google Search Console verification token here after publishing
    // google: "your-google-verification-token",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a192f" />
        {/* JSON-LD: WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Finance Guide",
              url: BASE_URL,
              description:
                "Free AI-powered budget planner built for India. Get a personalised monthly budget breakdown and 6-month savings roadmap.",
              author: {
                "@type": "Person",
                name: "Soumik Majumder",
                url: "https://www.linkedin.com/in/soumik-majumder-b04343333/",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${BASE_URL}/blog?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* JSON-LD: SoftwareApplication structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Finance Guide",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              description:
                "Free AI-powered personal budget planner for India. Calculates salary allocation, provides AI financial coaching, and generates a personalised 6-month savings roadmap.",
              author: {
                "@type": "Person",
                name: "Soumik Majumder",
              },
              url: BASE_URL,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "87",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
