"use client";

import { useState } from "react";
import { askGemini } from "@/app/lib/gemini";
import { calculateBenchmark, type BenchmarkResult } from "@/app/lib/benchmarkCalculator";
import { type BudgetResult } from "@/app/types/budget";

interface Props {
  result: BudgetResult;
}

const STATUS_CONFIG = {
  good: {
    bg: "bg-[#E1F5EE]",
    text: "text-[#0F6E56]",
    bar: "bg-[#1D9E75]",
    icon: "✓",
    label: "Normal",
  },
  warning: {
    bg: "bg-[#FAEEDA]",
    text: "text-[#854F0B]",
    bar: "bg-[#EF9F27]",
    icon: "!",
    label: "Above avg",
  },
  danger: {
    bg: "bg-[#FCEBEB]",
    text: "text-[#A32D2D]",
    bar: "bg-[#E24B4A]",
    icon: "↑",
    label: "High",
  },
  low: {
    bg: "bg-[#E6F1FB]",
    text: "text-[#185FA5]",
    bar: "bg-[#378ADD]",
    icon: "↓",
    label: "Below avg",
  },
};

export default function CityBenchmark({ result }: Props) {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);

  const benchmark: BenchmarkResult = calculateBenchmark(
    result.city,
    result.salary,
    result.breakdown
  );

  if (!benchmark.cityFound) {
    return (
      <div className="mb-6 rounded-xl border border-dashed border-[#dfe6f3] bg-[#f8f9fc] p-5 text-center">
        <p className="text-sm text-[#8892b0]">
          City benchmark data not available for <strong>{result.city}</strong> yet.
          We are adding more cities regularly.
        </p>
      </div>
    );
  }

  const savingsGap = benchmark.recommendedSavingsRate - benchmark.userSavingsRate;

  const handleGetAiInsight = async () => {
    setAiLoading(true);
    const topDeviation = benchmark.biggestDeviation;

    const prompt = `
You are a financial advisor analyzing ${result.name}'s budget in ${benchmark.cityName}.

Their salary: ₹${result.salary.toLocaleString()}/month
City cost index: ${benchmark.costIndex} (India average = 100)

Budget vs city averages for their salary band:
${benchmark.rows
  .map(
    (r) =>
      `- ${r.category}: their allocation ₹${r.userAmount.toLocaleString()} vs city avg ₹${r.cityAvg.toLocaleString()} (${r.label})`
  )
  .join("\n")}

Their savings rate: ${benchmark.userSavingsRate}% vs recommended ${benchmark.recommendedSavingsRate}% for ${benchmark.cityName}

Biggest deviation: ${topDeviation?.category} is ${topDeviation?.label}

Write exactly 2 sentences:
1. Comment on the biggest deviation — is it a problem or explainable?
2. One specific actionable tip for ${benchmark.cityName} — mention a real area, market, or local option.

Rules: Simple language, no jargon, under 60 words total, mention actual rupee amounts.
`;

    const response = await askGemini(prompt);
    setAiInsight(response);
    setAiLoading(false);
  };

  return (
    <div className="mb-6 rounded-xl border border-[#dfe6f3] bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#f8f9fc] hover:bg-[#f1f6ff] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📍</span>
          <div className="text-left">
            <p className="font-bold text-[#1d3557] text-sm">
              {benchmark.cityName} Cost Benchmark
            </p>
            <p className="text-xs text-[#8892b0]">
              Compared against{" "}
              <span className="font-semibold text-[#1d3557]">
                {benchmark.salaryBandLabel}
              </span>{" "}
              earners in {benchmark.cityName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Cost index badge */}
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              benchmark.costIndex > 130
                ? "bg-[#FCEBEB] text-[#A32D2D]"
                : benchmark.costIndex > 100
                ? "bg-[#FAEEDA] text-[#854F0B]"
                : "bg-[#E1F5EE] text-[#0F6E56]"
            }`}
          >
            Cost Index: {benchmark.costIndex}
          </span>
          <span className="text-[#8892b0] text-sm">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-6 py-5">
          {/* City note */}
          <p className="text-xs text-[#8892b0] mb-5 italic border-l-2 border-[#64ffda] pl-3">
            {benchmark.cityNotes}
          </p>

          {/* Benchmark rows */}
          <div className="space-y-4 mb-6">
            {benchmark.rows.map((row) => {
              const config = STATUS_CONFIG[row.status];
              const barWidth = Math.min(
                100,
                Math.round((row.userAmount / (row.cityAvg * 1.5)) * 100)
              );
              const avgBarWidth = Math.min(
                100,
                Math.round((row.cityAvg / (row.cityAvg * 1.5)) * 100)
              );

              return (
                <div key={row.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#1d3557]">
                      {row.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8892b0]">
                        City avg: ₹{row.cityAvg.toLocaleString()}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}
                      >
                        {config.icon} {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Your allocation bar */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#8892b0] w-16 shrink-0">Yours</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${config.bar} transition-all duration-500`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1d3557] w-20 text-right">
                      ₹{row.userAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* City avg bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8892b0] w-16 shrink-0">City avg</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gray-300 transition-all duration-500"
                        style={{ width: `${avgBarWidth}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#8892b0] w-20 text-right">
                      ₹{row.cityAvg.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Savings rate comparison */}
          <div
            className={`rounded-lg p-4 mb-5 ${
              savingsGap > 0
                ? "bg-[#FAEEDA] border border-[#EF9F27]"
                : "bg-[#E1F5EE] border border-[#1D9E75]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1d3557]">Savings Rate</p>
                <p className="text-xs text-[#8892b0]">
                  Recommended for {benchmark.cityName}: {benchmark.recommendedSavingsRate}%
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    savingsGap > 0 ? "text-[#854F0B]" : "text-[#0F6E56]"
                  }`}
                >
                  {benchmark.userSavingsRate}%
                </p>
                {savingsGap > 0 ? (
                  <p className="text-xs text-[#854F0B]">
                    {savingsGap}% below recommended
                  </p>
                ) : (
                  <p className="text-xs text-[#0F6E56]">On track ✓</p>
                )}
              </div>
            </div>
          </div>

          {/* Cheaper areas tip */}
          <div className="rounded-lg bg-[#f1f6ff] p-4 mb-5">
            <p className="text-xs font-bold text-[#1d3557] mb-1">
              More affordable areas in {benchmark.cityName}
            </p>
            <p className="text-xs text-[#8892b0]">
              {benchmark.cheaperAreas.join(" · ")}
            </p>
          </div>

          {/* AI Insight */}
          {!aiInsight && !aiLoading && (
            <button
              onClick={handleGetAiInsight}
              className="w-full rounded-lg bg-[#0a192f] py-2.5 text-sm font-semibold text-[#64ffda] hover:bg-[#112240] transition-colors"
            >
              ✨ Get AI insight for {benchmark.cityName}
            </button>
          )}

          {aiLoading && (
            <div className="rounded-lg bg-[#f8f9fc] p-4">
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          )}

          {aiInsight && (
            <div className="rounded-lg border-l-4 border-[#64ffda] bg-[#E1F5EE] p-4">
              <p className="text-xs font-bold text-[#0F6E56] mb-2 uppercase tracking-wider">
                AI Insight for {benchmark.cityName}
              </p>
              <p className="text-sm text-[#1d3557] leading-relaxed">{aiInsight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
