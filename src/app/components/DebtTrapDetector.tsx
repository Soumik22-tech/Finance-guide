"use client";

import React, { useState } from "react";
import { askGemini } from "@/app/lib/gemini";
import { calculateTotalDebtBurden, getDebtAvalancheOrder, getMonthsRemaining, getRemainingPrincipal, getTotalInterestRemaining, getPayoffDate } from "@/app/lib/loanCalculator";
import { type BudgetResult } from "@/app/types/budget";

interface Props {
  result: BudgetResult;
}

export default function DebtTrapDetector({ result }: Props) {
  const profile = result.liabilityProfile;
  if (!profile || profile.emis.length === 0) return null;

  const burden = calculateTotalDebtBurden(profile.emis, result.salary, result.breakdown as any);
  const [activeTab, setActiveTab] = useState<"overview" | "loans" | "strategy">("overview");
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [aiStrategy, setAiStrategy] = useState("");
  const [strategyLoading, setStrategyLoading] = useState(false);

  const avalancheOrder = getDebtAvalancheOrder(profile.emis);

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "safe": return { bg: "bg-[#E1F5EE]", border: "border-l-[#1D9E75]", text: "text-[#1D9E75]", badge: "bg-[#1D9E75] text-white" };
      case "caution": return { bg: "bg-[#FAEEDA]", border: "border-l-[#EF9F27]", text: "text-[#EF9F27]", badge: "bg-[#EF9F27] text-white" };
      case "danger": return { bg: "bg-[#FCEBEB]", border: "border-l-[#E24B4A]", text: "text-[#E24B4A]", badge: "bg-[#E24B4A] text-white" };
      case "critical": return { bg: "bg-[#F5D5D5]", border: "border-l-[#A32D2D]", text: "text-[#A32D2D]", badge: "bg-[#A32D2D] text-white" };
      default: return { bg: "bg-white", border: "border-l-gray-200", text: "text-gray-800", badge: "bg-gray-200 text-gray-800" };
    }
  };

  const colors = getSeverityColors(burden.severity);

  const getExitPlan = async () => {
    if (strategyLoading || aiStrategy) return;
    setStrategyLoading(true);

    const loansStr = profile.emis.map(e => {
      const remaining = e.loanDetails ? getMonthsRemaining(e.loanDetails.tenureMonths, e.loanDetails.startMonth, e.loanDetails.startYear) : 0;
      return `${e.typeLabel} (EMI: ₹${e.monthlyEMI}, Interest: ${e.loanDetails?.interestRate || 'Unknown'}%, Balance: ₹${Math.round(e.loanDetails ? e.loanDetails.originalAmount - (e.monthlyEMI * (e.loanDetails.tenureMonths - remaining)) : 0)})`;
    }).join('\n');

    const prompt = `You are a strict financial advisor helping someone escape a debt trap.
Monthly income: ₹${result.salary}
Total EMI: ₹${burden.totalMonthlyEMI} (${burden.debtToIncomeRatio}% DTI)
Total active loans: ${profile.emis.length}

Loans:
${loansStr}

Extra payment possible: ₹${extraPayment}

Give a 4-step actionable debt exit plan using the debt avalanche method. Keep it under 200 words.`;

    try {
      const response = await askGemini(prompt);
      setAiStrategy(response);
    } catch {
      setAiStrategy("Could not generate strategy. Please try again later.");
    } finally {
      setStrategyLoading(false);
    }
  };

  const currentSurplus = burden.monthlySurplus || 0;
  const sliderMax = Math.max(5000, Math.min(50000, Math.round((result.salary - burden.totalMonthlyEMI) * 0.3) || 10000));

  return (
    <div className={`mt-8 rounded-xl border border-r-[#dfe6f3] border-t-[#dfe6f3] border-b-[#dfe6f3] border-l-4 overflow-hidden ${colors.border} bg-white shadow-sm`}>
      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "overview" ? "border-[#0a192f] text-[#0a192f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("loans")}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "loans" ? "border-[#0a192f] text-[#0a192f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Loan Breakdown
        </button>
        <button
          onClick={() => setActiveTab("strategy")}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "strategy" ? "border-[#0a192f] text-[#0a192f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Payoff Strategy
        </button>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${colors.badge}`}>
                  {burden.severity.toUpperCase()} DEBT BURDEN
                </span>
                <h3 className="font-bold text-[#0a192f] text-xl">Debt Portfolio Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">You are spending {burden.debtToIncomeRatio}% of your income on debt repayment.</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${colors.text}`}>
                  {burden.debtToIncomeRatio}%
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">DTI Ratio</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Monthly EMI</p>
                <p className="font-bold text-[#0a192f] text-lg">₹{burden.totalMonthlyEMI.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Active Loans</p>
                <p className="font-bold text-[#0a192f] text-lg">{profile.emis.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Available Surplus</p>
                <p className={`font-bold text-lg ${currentSurplus < 0 ? 'text-red-500' : 'text-[#1D9E75]'}`}>₹{currentSurplus.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Estimated Interest</p>
                <p className="font-bold text-[#E24B4A] text-lg">₹{Math.round(burden.totalInterestRemaining).toLocaleString()}</p>
              </div>
            </div>

            {/* Severity Meter */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1 font-semibold">
                <span>Safe (&lt;30%)</span>
                <span>Caution (30-40%)</span>
                <span>Danger (40-50%)</span>
                <span>Critical (&gt;50%)</span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full opacity-80 ${colors.bg.replace('bg-', 'bg-').replace('[', '').replace(']', '')} ${burden.severity === 'critical' ? 'bg-[#7B0000]' : burden.severity === 'danger' ? 'bg-[#E24B4A]' : burden.severity === 'caution' ? 'bg-[#EF9F27]' : 'bg-[#1D9E75]'}`} 
                  style={{ width: `${Math.min(burden.debtToIncomeRatio, 100)}%` }}
                ></div>
                <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-white/50 z-10"></div>
                <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-white/50 z-10"></div>
                <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-white/50 z-10"></div>
              </div>
            </div>

            {burden.totalInterestRemaining > 0 && (
              <div className="bg-[#fff3cd] border border-[#ffecb5] p-4 rounded-xl text-sm text-[#856404] shadow-sm">
                You will pay <strong>₹{burden.totalInterestRemaining.toLocaleString()}</strong> in interest to banks before becoming debt free in <strong>{burden.latestFreedomDate}</strong>. Paying even <strong>₹{Math.round(burden.totalMonthlyEMI * 0.1).toLocaleString()}</strong> extra per month could save you significantly — check the <button type="button" onClick={() => setActiveTab("strategy")} className="font-bold underline cursor-pointer text-[#856404] hover:text-[#5c4503]">Payoff Strategy tab</button>.
              </div>
            )}
            
            {burden.debtToIncomeRatio > 40 && (
              <div className="bg-[#fff3cd] border-l-4 border-[#ffecb5] p-4 rounded text-sm text-[#856404]">
                <strong>Warning:</strong> Your debt-to-income ratio exceeds the recommended 30-40% threshold. You are at high risk of falling into a debt trap. Prioritize paying off high-interest debt immediately.
              </div>
            )}
          </div>
        )}

        {activeTab === "loans" && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#0a192f] text-lg mb-4">Your Loan Portfolio</h3>
            {profile.emis.map((emi) => {
              const hasDetails = !!emi.loanDetails && emi.hasLoanDetails;
              
              if (!hasDetails) {
                return (
                  <div key={emi.id} className="border border-gray-100 rounded-lg p-5 flex flex-col md:flex-row gap-4 justify-between bg-white shadow-sm hover:border-teal-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-bold text-[#1d3557]">{emi.typeLabel}</p>
                        <p className="text-xs text-gray-500 italic mt-1">Expand loan details in the form above to see remaining principal, interest cost, and payoff date for this loan.</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
                      <p className="font-bold text-xl text-[#0a192f]">₹{emi.monthlyEMI.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Per Month</p>
                    </div>
                  </div>
                );
              }

              const details = emi.loanDetails!;
              const monthsLeft = getMonthsRemaining(details.tenureMonths, details.startMonth, details.startYear);
              const remainingPrinc = getRemainingPrincipal(details.originalAmount, details.interestRate, details.tenureMonths, details.startMonth, details.startYear);
              const interestRemaining = getTotalInterestRemaining(details.originalAmount, details.interestRate, details.tenureMonths, details.startMonth, details.startYear);
              const payoffDate = getPayoffDate(details.tenureMonths, details.startMonth, details.startYear);
              const completionPercent = Math.max(0, Math.round((1 - monthsLeft / details.tenureMonths) * 100));
              const interestPercent = Math.round(interestRemaining / (monthsLeft * emi.monthlyEMI || 1) * 100);

              return (
                <div key={emi.id} className="border border-gray-100 rounded-lg p-5 flex flex-col gap-4 bg-white shadow-sm hover:border-teal-100 transition-colors">
                  {/* TOP SECTION */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-bold text-[#1d3557] text-lg">{emi.typeLabel}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {details.interestRate}% p.a. • {monthsLeft} months left
                        </p>
                      </div>
                    </div>
                    <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                      <p className="font-bold text-xl text-[#0a192f]">₹{emi.monthlyEMI.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mt-0.5">Per Month</p>
                    </div>
                  </div>

                  {/* BOTTOM SECTION */}
                  <div className="mt-2 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Remaining Principal</p>
                      <p className="font-bold text-[#0a192f] text-lg">₹{remainingPrinc.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Interest Still to Pay</p>
                      <p className="font-bold text-[#E24B4A] text-lg">₹{interestRemaining.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Loan Completion</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-[#0a192f] text-md">{completionPercent}%</span>
                        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500" style={{ width: `${completionPercent}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Debt Free Date</p>
                      <p className="font-bold text-[#0a192f] text-lg">{payoffDate}</p>
                    </div>
                  </div>
                  
                  {interestPercent > 0 && (
                    <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg p-3 mt-2 flex items-start gap-2">
                      <span className="text-yellow-600 text-lg">💡</span>
                      <p className="text-sm text-gray-700">
                        Of your remaining payments, <strong className="text-gray-900">{interestPercent}% is pure interest</strong> going to the bank — not reducing your debt.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "strategy" && (
          <div className="space-y-6">
            <h3 className="font-bold text-[#0a192f] text-lg">Debt Avalanche Strategy</h3>
            <p className="text-sm text-gray-600">The avalanche method mathematically saves you the most money by targeting the highest interest rate loans first while paying minimums on the rest.</p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-[#1d3557] mb-2">
                Extra monthly payment affordable: ₹{extraPayment.toLocaleString()}
              </label>
              <input 
                type="range" 
                min="0" 
                max={sliderMax} 
                step="500"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹0</span>
                <span>₹{sliderMax.toLocaleString()}</span>
              </div>
            </div>

            {extraPayment > 0 && avalancheOrder.length > 0 && (
              <div className="bg-[#E1F5EE] border border-[#1D9E75] p-4 rounded-xl text-sm">
                <p className="text-[#1D9E75] font-bold mb-1">Impact of Extra ₹{extraPayment}:</p>
                <p className="text-[#0a192f]">Apply this entire extra amount to your <strong>{avalancheOrder[0].typeLabel}</strong>. Once paid off, roll the entire payment into the next loan.</p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6">
              {!aiStrategy && !strategyLoading && (
                <button 
                  onClick={getExitPlan}
                  className="bg-[#0a192f] text-[#64ffda] px-4 py-3 rounded-lg text-sm font-bold hover:bg-opacity-90 w-full"
                >
                  Generate AI Execution Plan
                </button>
              )}

              {strategyLoading && (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg w-full"></div>
                  ))}
                </div>
              )}

              {aiStrategy && (
                <div className="prose prose-sm max-w-none text-gray-700">
                  <h4 className="flex items-center gap-2 text-[#0a192f] font-bold"><span className="text-xl">🤖</span> AI Recommended Plan</h4>
                  <div className="mt-4 space-y-4">
                    {aiStrategy.split("STEP ").filter(part => part.trim() !== "").map((part, index) => {
                      const lines = part.trim().split('\n');
                      const firstLine = lines[0] || "";
                      const title = firstLine.substring(firstLine.indexOf(':') + 1).trim();
                      const body = lines.slice(1).join('\n').trim();
                      
                      if (!title && !body) return null;

                      const renderWithBold = (text: string) => {
                        const parts = text.split(/\*\*(.*?)\*\*/g);
                        return parts.map((p, i) =>
                          i % 2 === 1
                            ? <strong key={i} className="font-semibold text-[#1d3557]">{p}</strong>
                            : <span key={i}>{p}</span>
                        );
                      };

                      return (
                        <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a192f] text-[#64ffda] flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1d3557] text-md">{renderWithBold(title)}</h4>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{renderWithBold(body)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}