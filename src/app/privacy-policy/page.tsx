import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: import("next").Metadata = {
  title: "Privacy Policy — Finance Guide",
  description:
    "Finance Guide's privacy policy. We do not store your salary or personal data. Learn how your information is handled when you use our free budget planner.",
  alternates: {
    canonical: "https://finance-guide.vercel.app/privacy-policy",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      body: `Finance Guide does not collect, store, or transmit any personally identifiable information. When you use the budget calculator, the details you enter — including your name, city, salary, and family information — are processed entirely within your browser. This data is never sent to our servers, never saved to a database, and never shared with any third party.

The only exception is when you voluntarily use the AI Financial Coach or Poverty Escape Roadmap features. In those cases, your budget data is sent to Google's Gemini API to generate a response. This transmission is governed by Google's own privacy policy. We do not retain any copy of this data after the response is returned to your browser.`,
    },
    {
      title: "2. Cookies and Local Storage",
      body: `Finance Guide does not use tracking cookies. We do not use advertising cookies, analytics cookies, or any form of cross-site tracking.

Your browser may store temporary data in local storage to preserve your session state (for example, a dark/light mode preference). This data never leaves your device and is not accessible to us.`,
    },
    {
      title: "3. Third-Party Services",
      body: `Finance Guide uses the following third-party services:

Google Fonts: We load the Inter typeface from Google Fonts. Google may log font request metadata (IP address, browser type) per their standard infrastructure. We have no control over this data.

Google Gemini AI: When you use the AI coach or roadmap features, your budget data is transmitted to Google's Gemini API. Please review Google's AI privacy policy at ai.google.dev for details on how Google handles this data.

We do not use Google Analytics, Facebook Pixel, or any advertising or behavioural tracking tools.`,
    },
    {
      title: "4. PDF Export",
      body: `When you download your budget as a PDF, the file is generated entirely within your browser using the jsPDF and html2canvas libraries. The PDF is never uploaded to or stored on our servers. It goes directly to your device's download folder.`,
    },
    {
      title: "5. Children's Privacy",
      body: `Finance Guide is intended for adults managing personal finances. We do not knowingly collect any information from individuals under the age of 18. If you believe a minor has used our service, please be aware that no data is retained by us in any case.`,
    },
    {
      title: "6. Changes to This Policy",
      body: `We may update this Privacy Policy as the app evolves. Any significant changes will be reflected on this page with an updated effective date. We encourage you to review this page periodically.`,
    },
    {
      title: "7. Contact",
      body: `If you have any questions about this Privacy Policy, please reach out to Soumik Majumder via email: soumikmajumder65@gmail.com`,
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0a192f] py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-[#8892b0] text-sm">Effective date: January 1, 2026</p>
          </div>
        </section>

        <section className="py-16 px-6 bg-[#f8f9fc]">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#dfe6f3] p-10 shadow-sm space-y-10">
              <p className="text-[#4a5568] text-sm leading-relaxed">
                Finance Guide is committed to protecting your privacy. This policy explains what data we collect (very little), how we use it, and what rights you have. If you have questions, contact us via email.
              </p>
              {sections.map((section, i) => (
                <div key={i}>
                  <h2 className="text-lg font-bold text-[#1d3557] mb-3">{section.title}</h2>
                  {section.body.split("\n\n").map((para, j) => (
                    <p key={j} className="text-[#4a5568] text-sm leading-relaxed mb-3">{para}</p>
                  ))}
                </div>
              ))}
              <div className="pt-6 border-t border-[#dfe6f3] text-center">
                <a
                  href="mailto:soumikmajumder65@gmail.com"
                  className="inline-block bg-[#64ffda] text-[#0a192f] font-bold px-8 py-3 rounded-xl hover:bg-[#52e0c4] transition-colors"
                >
                  Email Soumik
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
