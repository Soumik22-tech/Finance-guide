import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How Finance Guide Works — Free Indian Budget Calculator",
  description:
    "Learn how Finance Guide calculates your personalised monthly budget in 6 simple steps. No sign-up needed. Built specifically for Indian salaries and cities.",
  keywords: [
    "how to use budget planner",
    "budget calculator India how it works",
    "personal finance steps India",
    "salary allocation India",
  ],
  alternates: {
    canonical: "https://finance-guide.vercel.app/how-it-works",
  },
  openGraph: {
    title: "How Finance Guide Works — Free Indian Budget Calculator",
    description:
      "6 simple steps to a personalised monthly budget. Built for India. Free, fast, no account needed.",
    url: "https://finance-guide.vercel.app/how-it-works",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const steps = [
  {
    number: "01",
    title: "Enter your details",
    description:
      "Tell us your monthly salary, city, family size, housing situation, and a few other lifestyle details. It takes less than 2 minutes and no account is needed.",
    icon: "📝",
  },
  {
    number: "02",
    title: "We calculate your budget",
    description:
      "Our weighted allocation algorithm distributes 100% of your salary across essential categories — rent, food, savings, transport, and more — based on your exact situation.",
    icon: "⚙️",
  },
  {
    number: "03",
    title: "Get your personalized breakdown",
    description:
      "See exactly how much to spend in each category, with percentages of your income shown clearly. No guesswork, no generic advice.",
    icon: "📊",
  },
  {
    number: "04",
    title: "Talk to your AI Financial Coach",
    description:
      "Ask questions about your budget in plain language. Our AI coach explains what each number means, flags risky spending, and gives one actionable tip every time.",
    icon: "🤖",
  },
  {
    number: "05",
    title: "Get your 6-Month Escape Roadmap",
    description:
      "The AI generates a step-by-step monthly plan to build savings, reduce debt, and reach financial stability — all based on your real salary and city costs.",
    icon: "🗺️",
  },
  {
    number: "06",
    title: "Download your plan as PDF",
    description:
      "Export your entire budget plan — including the AI summary and roadmap — as a beautifully designed PDF you can save, print, or share.",
    icon: "📄",
  },
];

const whyCards = [
  {
    title: "100% Free",
    body: "No subscriptions, no hidden fees, no account required. Finance Guide is completely free to use for everyone.",
    icon: "✅",
  },
  {
    title: "Built for India",
    body: "Unlike generic Western finance tools, our budget logic is calibrated for Indian cities, salaries, and cost-of-living realities.",
    icon: "🇮🇳",
  },
  {
    title: "Designed for Beginners",
    body: "No financial jargon. Every number is explained in plain language. Perfect for anyone managing money for the first time.",
    icon: "🎓",
  },
  {
    title: "Privacy First",
    body: "We never store your personal or salary data. Everything is calculated in your browser and immediately discarded.",
    icon: "🔒",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Create a Personalised Budget Plan Using Finance Guide",
            description:
              "A step-by-step guide to creating a free personalised monthly budget plan for your Indian salary using Finance Guide.",
            step: [
              {
                "@type": "HowToStep",
                name: "Enter your details",
                text: "Input your monthly salary, city, marital status, family size, housing type, and transport preference.",
              },
              {
                "@type": "HowToStep",
                name: "We calculate your budget",
                text: "Our weighted algorithm distributes 100% of your salary across essential financial categories.",
              },
              {
                "@type": "HowToStep",
                name: "Get your personalised breakdown",
                text: "See exactly how much to allocate to rent, food, savings, transport and more — with percentage insights.",
              },
              {
                "@type": "HowToStep",
                name: "Talk to your AI Financial Coach",
                text: "Ask questions about your budget in plain language and get personalised, jargon-free advice.",
              },
              {
                "@type": "HowToStep",
                name: "Get your 6-Month Escape Roadmap",
                text: "Receive a month-by-month savings plan tailored to your salary and city.",
              },
              {
                "@type": "HowToStep",
                name: "Download your plan as PDF",
                text: "Export a professionally designed PDF of your complete budget plan.",
              },
            ],
          }),
        }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0a192f] py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              How Finance Guide Works — India's Free Budget Calculator
            </h1>
            <p className="text-[#8892b0] text-lg leading-relaxed">
              From salary input to a complete personalised budget plan in under 2 minutes. No sign-up. No financial jargon. Built for Indian households.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 px-6 bg-[#f8f9fc]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0a192f] text-center mb-14">
              6 Simple Steps
            </h2>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 bg-white rounded-2xl p-7 shadow-sm border border-[#dfe6f3] items-start"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#0a192f] flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#64ffda] uppercase tracking-widest mb-1">
                      Step {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-[#1d3557] mb-2">{step.title}</h3>
                    <p className="text-[#4a5568] text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Finance Guide */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0a192f] text-center mb-14">
              Why Finance Guide?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyCards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#dfe6f3] p-7 bg-[#f8f9fc]"
                >
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h3 className="text-lg font-bold text-[#1d3557] mb-2">{card.title}</h3>
                  <p className="text-[#4a5568] text-sm leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0a192f] py-16 px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to plan your finances?
          </h2>
          <p className="text-[#8892b0] mb-8 text-sm">
            It is free, fast, and built for people just like you.
          </p>
          <Link
            href="/#dashboard"
            className="inline-block bg-[#64ffda] text-[#0a192f] font-bold px-8 py-3 rounded-xl hover:bg-[#52e0c4] transition-colors"
          >
            Get Your Free Budget Plan
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
