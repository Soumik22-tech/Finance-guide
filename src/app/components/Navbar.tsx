"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", href: "/#dashboard" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "/faqs" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a192f] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-bold text-white hover:text-[#64ffda] transition-colors">
          Finance Guide
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#64ffda] ${
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && link.href !== "/#dashboard")
                  ? "text-[#64ffda]"
                  : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50"
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a192f] border-t border-[#112240] absolute w-full px-6 py-4 flex flex-col gap-4 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition-colors hover:text-[#64ffda] block py-2 ${
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]) && link.href !== "/#dashboard")
                  ? "text-[#64ffda]"
                  : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
