"use client";
import React, { useState, useEffect, useRef } from 'react';
import { BudgetResult as BudgetResultType } from '../types/budget';
import { exportBudgetPDF } from "@/app/lib/exportPDF";
import BudgetPDFTemplate from "@/app/components/BudgetPDFTemplate";
import AiCoach from './AiCoach';
import PovertyEscapeRoadmap from './PovertyEscapeRoadmap';
import { askGemini } from '../lib/gemini';

// ── Static tooltips for each budget category ──────────────────────────────────
const categoryTooltips: Record<string, string> = {
  'Rent': 'The monthly payment for the place you live in.',
  'EMI': 'A fixed monthly installment you pay to clear your home loan.',
  'Maintenance': 'Money kept aside to repair and maintain your own house.',
  'Utilities': 'Bills for electricity, water, and gas used at home.',
  'Transportation': 'Money spent on getting around — bus, auto, petrol, etc.',
  'Food & Groceries': 'What you spend on daily meals, vegetables, and groceries.',
  'Internet & Subscriptions': 'Your internet plan, streaming apps, and other monthly subscriptions.',
  'Insurance': 'A safety net — you pay a small amount now so big bills are covered later.',
  'Emergency Fund': 'Money saved for sudden problems like illness, job loss, or urgent repairs.',
  'Miscellaneous': 'Small everyday expenses that don\'t fit into any other category.',
  'Child Expenses': 'School fees, books, clothes, and other costs for your kids.',
  'Savings & Investment': 'Money you keep aside every month to grow your wealth for the future.',
};

// ── InfoIcon with tooltip ─────────────────────────────────────────────────────
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-[#1d3557]/40 hover:text-[#64ffda] transition-colors focus:outline-none"
        aria-label="More info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </button>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#0a192f] text-white text-xs rounded-xl px-3 py-2 leading-snug shadow-xl pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0a192f]" />
        </span>
      )}
    </span>
  );
}

// ── AI Summary Card ───────────────────────────────────────────────────────────
function AiSummaryCard({ result, onSummaryGenerated }: { result: BudgetResultType, onSummaryGenerated: (text: string) => void }) {
  const [summaryText, setSummaryText] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    const top3 = Object.entries(result.breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k}: ₹${v.toLocaleString()}`)
      .join(', ');

    const savings = result.breakdown['Savings & Investment'] ?? 0;

    const prompt = `
You are explaining a monthly budget to ${result.name} from ${result.city} who may not understand financial terms.

Their salary: ₹${result.salary.toLocaleString()}/month
Top 3 allocations: ${top3}
Savings allocated: ₹${savings.toLocaleString()}

Write exactly 3 sentences explaining this budget in very simple language:
1. What their biggest expense is and whether it is normal for their city
2. Whether their savings amount is good or needs improvement  
3. The single most important thing they should focus on this month

Rules:
- No financial jargon at all
- Sound like a helpful friend, not a bank
- Use their actual rupee amounts
- Keep total response under 80 words
`;

    const response = await askGemini(prompt);
    setSummaryText(response);
    onSummaryGenerated(response);
    setSummaryLoading(false);
  };

  return (
    <div className="mb-6 rounded-xl border-l-4 border-[#64ffda] bg-[#E1F5EE] p-4">
      {/* AI Summary Section — user triggered */}
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-[#64ffda] px-2 py-0.5 text-xs font-semibold text-[#0a192f]">
          AI Summary
        </span>
      </div>

      {!summaryText && !summaryLoading && (
        <button
          onClick={handleGenerateSummary}
          className="mt-1 rounded-lg bg-[#0a192f] px-4 py-2 text-sm font-semibold text-[#64ffda] transition hover:bg-[#112240]"
        >
          ✨ Explain my budget in simple words
        </button>
      )}

      {summaryLoading && (
        <div className="mt-2 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-[#9FE1CB]" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-[#9FE1CB]" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-[#9FE1CB]" />
        </div>
      )}

      {summaryText && !summaryLoading && (
        <p className="mt-1 text-sm leading-relaxed text-[#1d3557]">{summaryText}</p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  result: BudgetResultType;
  onReset: () => void;
}

export default function BudgetResult({ result, onReset }: Props) {
  const [pdfSummary, setPdfSummary] = useState<string>("");
  const [pdfRoadmap, setPdfRoadmap] = useState<{ title: string; body: string }[]>([]);
  const [pdfGoal, setPdfGoal] = useState<string>("");

  const categories = Object.keys(result.breakdown);
  const totalAmount = Object.values(result.breakdown).reduce((sum, val) => sum + val, 0);

  const handleDownloadPDF = async () => {
    await exportBudgetPDF("pdf-export-template", `${result.name}_budget_plan.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-gray-100 mt-12">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#1d3557] mb-2">{result.name}'s Monthly Budget</h2>
        <p className="text-gray-500">Your personalized monthly budget breakdown</p>
      </div>

      {/* ── AI Summary (auto-generates on mount) ── */}
      <AiSummaryCard result={result} onSummaryGenerated={setPdfSummary} />

      {/* ── Budget Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {categories.map((cat, idx) => {
          const amount = result.breakdown[cat];
          const percentage = ((amount / result.salary) * 100).toFixed(1);
          const tooltip = categoryTooltips[cat];

          return (
            <div
              key={idx}
              className="bg-[#f1f6ff] p-6 rounded-xl border border-blue-50 shadow-sm flex flex-col items-start hover:shadow-md transition duration-300"
            >
              <h3 className="text-[#1d3557] font-semibold text-lg mb-2 flex items-center">
                {cat}
                {tooltip && <InfoTooltip text={tooltip} />}
              </h3>
              <div className="text-3xl font-black text-[#00449e] mb-1">
                ₹{amount.toLocaleString()}
              </div>
              <span className="text-sm text-gray-500 font-medium">{percentage}% of income</span>
            </div>
          );
        })}

        {/* TOTAL CARD */}
        <div className="bg-[#0a192f] p-6 rounded-xl border border-gray-800 shadow-md flex flex-col items-start transform md:scale-105">
          <h3 className="text-gray-300 font-semibold text-lg mb-2">Total Amount</h3>
          <div className="text-3xl font-black text-[#64ffda] mb-1">
            ₹{totalAmount.toLocaleString()}
          </div>
          <span className="text-sm text-gray-400 font-medium">
            {((totalAmount / result.salary) * 100).toFixed(1)}% of income
          </span>
        </div>
      </div>

      <AiCoach budgetResult={result} />

      <PovertyEscapeRoadmap 
        budgetResult={result} 
        onRoadmapGenerated={(roadmap, goal) => {
          setPdfRoadmap(roadmap);
          setPdfGoal(goal);
        }}
      />

      <div className="flex flex-col sm:flex-row justify-center gap-4 border-t pt-8 mt-8">
        <button
          onClick={handleDownloadPDF}
          className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-600"
        >
          📄 Download as PDF
        </button>
        <button
          onClick={onReset}
          className="bg-white text-[#00449e] font-bold py-3 px-8 rounded-xl border-2 border-[#00449e] hover:bg-blue-50 transition"
        >
          Create New Plan
        </button>
      </div>

      {/* Hidden PDF template — rendered off-screen, captured by html2canvas */}
      <BudgetPDFTemplate
        result={result}
        summaryText={pdfSummary}
        roadmap={pdfRoadmap}
        goal={pdfGoal}
      />
    </div>
  );
}
