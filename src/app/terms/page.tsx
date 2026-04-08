import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: import("next").Metadata = {
  title: "Terms of Service — Finance Guide",
  description:
    "Terms and conditions for using Finance Guide — India's free AI-powered budget planner. Read before using the service.",
  alternates: {
    canonical: "https://finance-guide.vercel.app/terms",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: `By accessing or using Finance Guide (the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the Service.`,
    },
    {
      title: "2. Nature of the Service",
      body: `Finance Guide is an educational budgeting tool designed to help individuals understand how to allocate their income. The budget plans, AI-generated advice, and roadmaps provided by this Service are for informational and educational purposes only.

Finance Guide is not a registered financial advisor, investment advisor, or chartered accountant. Nothing on this platform constitutes professional financial advice. You should not make significant financial decisions — including investments, loans, or large purchases — based solely on the output of this tool without consulting a qualified professional.`,
    },
    {
      title: "3. No Guarantee of Accuracy",
      body: `While we strive to provide useful and realistic budget recommendations, Finance Guide does not guarantee the accuracy, completeness, or suitability of any budget plan for your specific circumstances. The AI-generated content (coach responses, roadmaps, summaries) is produced by Google's Gemini AI and may occasionally contain errors or outdated information.

Use the output as a starting point for your own financial planning, not as a definitive financial prescription.`,
    },
    {
      title: "4. User Responsibilities",
      body: `You agree to use Finance Guide only for lawful, personal, non-commercial purposes. You agree not to attempt to reverse-engineer, scrape, or abuse the Service or its underlying APIs. You are responsible for the accuracy of the information you input into the calculator.`,
    },
    {
      title: "5. AI-Generated Content",
      body: `Finance Guide uses Google's Gemini API to generate AI responses. The quality, accuracy, and appropriateness of AI-generated responses are subject to the capabilities and limitations of that model. We are not responsible for any decisions you make based on AI-generated content.

AI responses are generated fresh each time and are not stored by Finance Guide. Google's use of data transmitted to their API is governed by Google's own terms of service and privacy policy.`,
    },
    {
      title: "6. Intellectual Property",
      body: `The Finance Guide name, logo, design, and all written content on this website are the intellectual property of Soumik Majumder. You may not reproduce, distribute, or create derivative works from any part of this Service without explicit written permission.

The underlying open-source libraries used (Next.js, jsPDF, html2canvas, Tailwind CSS) remain subject to their respective open-source licences.`,
    },
    {
      title: "7. Limitation of Liability",
      body: `To the maximum extent permitted by applicable law, Finance Guide and its creator shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to financial losses resulting from budgeting decisions made using this tool.`,
    },
    {
      title: "8. Modifications to the Service",
      body: `We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice. We may also update these Terms of Service. Continued use of the Service after changes are posted constitutes your acceptance of the revised terms.`,
    },
    {
      title: "9. Governing Law",
      body: `These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or the use of this Service shall be subject to the jurisdiction of courts in West Bengal, India.`,
    },
    {
      title: "10. Contact",
      body: `If you have questions about these Terms of Service, please contact Soumik Majumder via email: soumikmajumder65@gmail.com`,
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0a192f] py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-3">Terms of Service</h1>
            <p className="text-[#8892b0] text-sm">Effective date: January 1, 2026</p>
          </div>
        </section>

        <section className="py-16 px-6 bg-[#f8f9fc]">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#dfe6f3] p-10 shadow-sm space-y-10">
              <p className="text-[#4a5568] text-sm leading-relaxed">
                Please read these Terms of Service carefully before using Finance Guide. These terms govern your use of the website and its features.
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
