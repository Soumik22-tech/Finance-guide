"use client";
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';

import BudgetForm from './components/BudgetForm';
import BudgetResult from './components/BudgetResult';
import Footer from './components/Footer';
import { BudgetResult as BudgetResultType } from './types/budget';

export default function HomeClient() {
  const [result, setResult] = useState<BudgetResultType | null>(null);

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen font-sans bg-[#f8f9fc] text-[#1d3557] selection:bg-[#64ffda] selection:text-[#0a192f]">
      <Navbar />
      
      <main>
        <HeroSection />

        
        <section id="dashboard" className="w-full bg-[#f1f6ff] py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1d3557] mb-4">
                Your Finance Dashboard
              </h2>
              <p className="text-lg text-gray-600">
                Generate your specialized plan by filling out the details below.
              </p>
            </div>

            <div className="flex flex-col gap-12">
              {/* Form is always visible unless you only want to show result strictly. We'll stack them nicely so user can update values! */}
               <BudgetForm onResult={setResult} />
               
               {result && (
                 <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <BudgetResult result={result} onReset={handleReset} />
                 </div>
               )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
