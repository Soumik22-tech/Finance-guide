import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a192f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-[#64ffda] mb-4">Finance Guide</h3>
            <p className="text-[#8892b0] text-sm leading-relaxed max-w-xs">
              Making financial literacy accessible and engaging for everyone, everywhere. Plan smarter, live better.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="mailto:soumikmajumder65@gmail.com"
                className="w-9 h-9 rounded-full bg-[#112240] flex items-center justify-center text-[#8892b0] hover:text-[#64ffda] hover:bg-[#1d3557] transition-all"
                aria-label="Email"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
              <a
                href="https://github.com/Soumik22-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#112240] flex items-center justify-center text-[#8892b0] hover:text-[#64ffda] hover:bg-[#1d3557] transition-all"
                aria-label="GitHub"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "How it Works", href: "/how-it-works" },
                { label: "Blog", href: "/blog" },
                { label: "FAQs", href: "/faqs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#8892b0] text-sm hover:text-[#64ffda] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#8892b0] text-sm hover:text-[#64ffda] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1d3557] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#8892b0] text-xs">
            © 2026 Finance Guide. All rights reserved.
          </p>
          <p className="text-[#8892b0] text-xs">
            Developed by{" "}
            <a
              href="mailto:soumikmajumder65@gmail.com"
              className="text-[#64ffda] font-semibold hover:underline"
            >
              Soumik Majumder
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
