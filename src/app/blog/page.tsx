import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const metadata: import("next").Metadata = {
  title: "Finance Blog — Budgeting Tips and Money Advice for India",
  description:
    "Practical financial articles for everyday Indians. Budgeting guides, salary management tips, savings strategies, and investment basics — written in simple language.",
  keywords: [
    "personal finance blog India",
    "budgeting tips India",
    "how to save money India",
    "salary management tips",
    "investment advice India beginners",
  ],
  alternates: {
    canonical: "https://finance-guide.vercel.app/blog",
  },
  openGraph: {
    title: "Finance Blog — Budgeting Tips and Money Advice for India",
    description:
      "Simple, practical financial articles for everyday Indians. No jargon. Just actionable advice.",
    url: "https://finance-guide.vercel.app/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const posts = [
  {
    slug: "50-30-20-rule-india",
    title: "The 50/30/20 Rule: Does It Actually Work for Indian Salaries?",
    excerpt:
      "The popular 50/30/20 budgeting rule says spend 50% on needs, 30% on wants, and save 20%. But with rising rents in Mumbai and Bangalore, is this rule realistic for India? We break it down city by city.",
    date: "March 15, 2026",
    readTime: "6 min read",
    category: "Budgeting Basics",
    emoji: "💰",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0a192f] py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Finance Blog — Money Tips for Everyday Indians
            </h1>
            <p className="text-[#8892b0] text-lg">
              Practical budgeting guides, savings strategies, and money advice — written in plain language for Indian households.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-20 px-6 bg-[#f8f9fc]">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-[#dfe6f3] p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{post.emoji}</span>
                    <span className="text-xs font-bold text-[#64ffda] bg-[#0a192f] px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1d3557] mb-3 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-[#4a5568] text-sm leading-relaxed mb-5">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#8892b0]">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-semibold text-[#0a192f] border border-[#0a192f] px-4 py-2 rounded-lg hover:bg-[#0a192f] hover:text-[#64ffda] transition-all"
                    >
                      Read Article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Coming soon notice */}
            <div className="mt-12 text-center bg-white rounded-2xl border border-dashed border-[#dfe6f3] p-10">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-lg font-bold text-[#1d3557] mb-2">More articles coming soon</h3>
              <p className="text-[#8892b0] text-sm">
                We are writing practical guides on saving, investing, debt management, and more for Indian readers.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
