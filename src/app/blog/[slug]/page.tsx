import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

const posts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}> = {
  "50-30-20-rule-india": {
    title: "The 50/30/20 Rule: Does It Actually Work for Indian Salaries?",
    seoTitle: "Does the 50/30/20 Budget Rule Work for Indian Salaries? — Finance Guide",
    seoDescription:
      "The 50/30/20 rule is popular worldwide — but does it work for Indian salaries and metro rents? We break it down city by city for Mumbai, Delhi, Kolkata, and more.",
    keywords: [
      "50 30 20 rule India",
      "budget rule Indian salary",
      "how to budget salary India",
      "50 30 20 rule Mumbai",
      "personal finance India",
      "budgeting for Indians",
    ],
    date: "March 15, 2026",
    readTime: "6 min read",
    category: "Budgeting Basics",
    content: `
The 50/30/20 rule is one of the most talked-about budgeting frameworks in personal finance. The idea is elegantly simple: allocate 50% of your after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. It was popularized by US Senator Elizabeth Warren in her book "All Your Worth" and has since become the go-to advice on every financial blog worldwide.

But here is the problem — it was designed for American incomes and American cities. So what happens when we apply it to someone earning ₹40,000 a month in Mumbai or ₹25,000 in Kolkata?

## The Reality of Rent in Indian Metro Cities

In Mumbai, a decent 1BHK in a reasonably connected area costs between ₹15,000 and ₹25,000 per month. If you earn ₹40,000 a month, your rent alone eats up 37% to 62% of your income — before you have paid for food, transport, or utilities. The 50% "needs" bucket is already overflowing just with housing.

This is the first crack in the 50/30/20 framework for India. The rule assumes housing costs are moderate relative to income. In Indian metros, for entry-level and mid-level earners, they simply are not.

## Food and Transport: Two More Heavy Hitters

For a family of four in Kolkata, a realistic monthly grocery bill runs between ₹8,000 and ₹14,000 depending on diet and neighbourhood. Add cooking gas, local transport (even using public buses and the metro), school fees, and mobile recharges — and the "needs" category balloons well past 50% for most middle-class families.

The 30% "wants" bucket — eating out, entertainment, shopping — sounds aspirational but is functionally inaccessible for anyone earning below ₹60,000 a month in a metro, once real needs are covered.

## So Should You Abandon the Rule?

Not entirely. The spirit of 50/30/20 is sound: spend less than you earn, distinguish between needs and wants, and make saving non-negotiable. Those principles are universal and valuable.

What needs to change is the percentages. For Indian earners, a more realistic framework might look like:

- **60–65% on needs** (rent, food, utilities, transport, school fees)
- **10–15% on wants** (dining out, entertainment, occasional shopping)
- **20–25% on savings and investments** (emergency fund, SIP, RD)

The key insight is that savings must be treated as a fixed expense, not what is left over. Pay yourself first — even if it is just ₹1,000 a month into a recurring deposit. That habit, sustained over years, is what separates people who build wealth from people who wonder where their salary went.

## What Finance Guide Does Differently

Instead of forcing a fixed ratio on everyone, Finance Guide uses a weighted allocation algorithm that adapts to your specific situation — your city, your family size, whether you rent or own, whether you have children, and your transport type. The result is a budget that reflects your reality, not a textbook example.

If you have not tried it yet, fill in your details on the home page and see your personalised breakdown in under a minute.

## The One Rule That Always Applies

Regardless of which percentage framework you use, one rule holds universally: spend less than you earn. Everything else is refinement. If your needs genuinely exceed your income, the answer is not a better budget — it is finding ways to increase income or reduce fixed costs like rent. A budget is a tool, not a magic solution.

Start where you are. Track what you spend for one month. Then use a tool like Finance Guide to build a realistic plan for the next one.
    `,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: post.keywords,
    authors: [{ name: "Soumik Majumder" }],
    alternates: {
      canonical: `https://finance-guide.vercel.app/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.seoDescription,
      url: `https://finance-guide.vercel.app/blog/${slug}`,
      publishedTime: post.date,
      authors: ["Soumik Majumder"],
      section: post.category,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  const paragraphs = post.content.trim().split("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.seoDescription,
            author: {
              "@type": "Person",
              name: "Soumik Majumder",
              url: "https://www.linkedin.com/in/soumik-majumder-b04343333/",
            },
            publisher: {
              "@type": "Organization",
              name: "Finance Guide",
              url: "https://finance-guide.vercel.app",
            },
            datePublished: post.date,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://finance-guide.vercel.app/blog/${slug}`,
            },
          }),
        }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0a192f] py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <Link href="/blog" className="text-[#64ffda] text-sm hover:underline mb-6 inline-block">
              ← Back to Blog
            </Link>
            <div className="mb-4">
              <span className="text-xs font-bold text-[#64ffda] bg-[#112240] px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-snug mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-[#8892b0] text-sm">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="py-16 px-6 bg-[#f8f9fc]">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#dfe6f3] p-10 shadow-sm">
              {paragraphs.map((para, i) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-xl font-bold text-[#1d3557] mt-8 mb-3">
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                // Handle bold text with **
                const parts = para.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={i} className="text-[#4a5568] text-sm leading-relaxed mb-5">
                    {parts.map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="font-semibold text-[#1d3557]">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-[#0a192f] rounded-2xl p-8 text-center">
              <p className="text-white font-bold text-lg mb-2">Try Finance Guide for free</p>
              <p className="text-[#8892b0] text-sm mb-6">Get your personalised budget breakdown in under 2 minutes.</p>
              <Link
                href="/#dashboard"
                className="inline-block bg-[#64ffda] text-[#0a192f] font-bold px-8 py-3 rounded-xl hover:bg-[#52e0c4] transition-colors"
              >
                Calculate My Budget
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
