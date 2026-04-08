"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section id="home" className="w-full bg-[#0a192f] py-20 px-6 md:px-12 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Free Budget Planner for India — Plan Your Salary Smarter
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-lg">
            Enter your salary and get a personalised monthly budget breakdown, AI financial advice, and a 6-month savings roadmap — completely free, built for Indian households.
          </p>
          <Link 
            href="#dashboard" 
            className="inline-block bg-[#64ffda] text-[#0a192f] font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#4cdbba] transition-colors"
          >
            Get Your Free Budget Plan
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            src="/images.png"
            alt="Finance Guide budget planner illustration showing personalised budget breakdown for Indian households"
            width={480}
            height={400}
            priority={true}
            className="w-full max-w-[480px] rounded-xl animate-[float_4s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </section>
  );
}
