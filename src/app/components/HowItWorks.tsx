"use client";
import React from 'react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-[#f8f9fc] py-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1d3557]">
          How it Works
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Our intuitive financial calculator helps you construct a personalized budget instantly. 
          Simply input your income, demographic information, and basic lifestyle choices into the form.
          Our algorithm will allocate resources optimally using verified financial constants tailored 
          for various living arrangements and personal circumstances.
        </p>
      </div>
    </section>
  );
}
