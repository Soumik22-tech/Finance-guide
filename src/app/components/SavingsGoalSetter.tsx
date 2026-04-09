"use client";

import React, { useState, useEffect } from "react";
import { askGemini } from "@/app/lib/gemini";
import { SavingsGoal, TimeHorizon } from "@/app/types/goals";
import { BudgetResult } from "@/app/types/budget";
import { calculateBenchmark } from "@/app/lib/benchmarkCalculator";
import {
  getTimeHorizon,
  calculateMonthlySavingsNeeded,
  getInvestmentOptions,
  identifyCuttableCategories,
  getMilestones
} from "@/app/lib/goalCalculator";

interface Props {
  result: BudgetResult;
}

export default function SavingsGoalSetter({ result }: Props) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [targetMonths, setTargetMonths] = useState<number>(12);
  const [riskPreference, setRiskPreference] = useState<string>("safe");
  
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  // Mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("finance-guide-goals");
      if (saved) {
        setGoals(JSON.parse(saved));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("finance-guide-goals", JSON.stringify(goals));
    }
  }, [goals, mounted]);

  const monthlyNeeded = targetAmount > 0 && targetMonths > 0 ? calculateMonthlySavingsNeeded(targetAmount, targetMonths, 7) : 0;
  const currentSavings = result.breakdown["Savings & Investment"] || 0;
  const gap = Math.max(0, monthlyNeeded - currentSavings);
  const timeHorizon = getTimeHorizon(targetMonths);
  const activeOptions = targetAmount > 0 && targetMonths > 0 ? getInvestmentOptions(targetAmount, targetMonths, monthlyNeeded, riskPreference as "safe" | "moderate" | "aggressive") : [];
  const cuttable = gap > 0 ? identifyCuttableCategories(result.breakdown, result.salary, result.city, gap) : [];

  const handleSaveGoal = () => {
    if (!goalName.trim() || targetAmount <= 0 || targetMonths <= 0 || targetMonths > 360) return;
    if (goals.length >= 3) {
      alert("You can track up to 3 goals at a time. Remove one to add a new goal.");
      return;
    }
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: goalName,
      targetAmount,
      targetMonths,
      riskPreference,
      monthlySavingsNeeded: monthlyNeeded,
      currentSavingsAllocation: currentSavings,
      gap,
      createdAt: Date.now(),
      city: result.city,
      salary: result.salary
    };
    setGoals([...goals, newGoal]);
    setGoalName("");
    setTargetAmount(0);
    setTargetMonths(12);
    setRiskPreference("safe");
    setAiSuggestion("");
    setShowAddForm(false);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleGetAiSuggestion = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    const cutsStr = cuttable.map(c => `${c.category}: ₹${c.currentAmount}, cut by ₹${c.suggestedCut} (${c.reasoning})`).join("\n");
    const bestOption = activeOptions[0]?.name || "Fixed Deposit";
    const avgReturn = activeOptions[0]?.annualReturnAvgCase || 6.5;
    
    const prompt = `You are a financial advisor helping ${result.name} from ${result.city} who earns ₹${result.salary} per month.
They want to save for: ${goalName}
Target amount: ₹${targetAmount}
Target timeline: ${targetMonths} months (${timeHorizon} term goal)
Monthly savings needed: ₹${monthlyNeeded}
Currently saving: ₹${currentSavings} per month
Monthly gap to fill: ₹${gap}

User's risk preference: ${riskPreference} (safe means they want guaranteed returns, moderate means some market exposure is okay, aggressive means they want maximum equity growth).

Their current spending vs city averages shows these potential cuts:
${cutsStr}

Best investment option for this goal given their timeline: ${bestOption} with avg ${avgReturn}% annual return

Write exactly 3 sentences:
1. Whether their goal timeline is realistic given their current savings rate
2. The single most impactful budget category to cut and by exactly how much in rupees to close the gap
3. Which investment option is best for this specific goal and why in one simple sentence

Rules: Use real rupee amounts. Simple language. No jargon. Be encouraging. Under 80 words total.`;

    try {
      const resp = await askGemini(prompt);
      setAiSuggestion(resp);
    } catch {
      setAiSuggestion("Could not generate AI suggestion.");
    } finally {
      setAiLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1d3557]">Smart Savings Goals</h2>
          <p className="text-sm text-gray-500 mt-1">Set a financial goal and get a personalised savings and investment plan.</p>
        </div>
        {goals.length < 3 && !showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-[#0a192f] text-[#64ffda] px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            Add Goal
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#1d3557] text-lg">Create a New Goal</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Goal Name</label>
              <input 
                type="text" 
                value={goalName} 
                onChange={(e) => setGoalName(e.target.value)} 
                placeholder="e.g. Buy a phone, Emergency fund, Vacation"
                className="w-full bg-[#f8f9fc] rounded-lg px-4 py-2.5 border border-gray-200 outline-none focus:ring-2 focus:ring-[#64ffda] text-[#1d3557]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Target Amount (₹)</label>
              <input 
                type="number" 
                value={targetAmount || ""} 
                onChange={(e) => setTargetAmount(Number(e.target.value))} 
                placeholder="Target amount ₹"
                className="w-full bg-[#f8f9fc] rounded-lg px-4 py-2.5 border border-gray-200 outline-none focus:ring-2 focus:ring-[#64ffda] text-[#1d3557]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Timeline (Months)</label>
              <input 
                type="number" 
                value={targetMonths || ""} 
                onChange={(e) => setTargetMonths(Number(e.target.value))} 
                placeholder="Months to achieve"
                className="w-full bg-[#f8f9fc] rounded-lg px-4 py-2.5 border border-gray-200 outline-none focus:ring-2 focus:ring-[#64ffda] text-[#1d3557]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Risk Preference</label>
              <select 
                value={riskPreference} 
                onChange={(e) => setRiskPreference(e.target.value)} 
                className="w-full bg-[#f8f9fc] rounded-lg px-4 py-2.5 border border-gray-200 outline-none focus:ring-2 focus:ring-[#64ffda] text-[#1d3557]"
              >
                <option value="safe">Safe — I want guaranteed returns</option>
                <option value="moderate">Little Riskier — some market exposure is okay</option>
                <option value="aggressive">Riskier — I want maximum growth</option>
              </select>
            </div>
          </div>

          {targetAmount > 0 && targetMonths > 0 && (
            <div className="animate-fade-in space-y-6 bg-[#f8f9fc] -mx-6 p-6 border-t border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Monthly savings needed</p>
                  <p className="text-xl font-bold text-[#0a192f]">₹{monthlyNeeded.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Currently saving</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <span className="text-[#0a192f]">₹{currentSavings.toLocaleString()}</span>
                    {currentSavings >= monthlyNeeded ? (
                      <span className="text-green-500 text-sm">✅</span>
                    ) : (
                      <span className="text-red-400 text-sm">⚠️</span>
                    )}
                  </p>
                </div>
                <div className={`p-4 rounded-xl shadow-sm border ${gap === 0 ? 'bg-[#E1F5EE] border-[#1D9E75]' : gap > 5000 ? 'bg-[#FCEBEB] border-[#E24B4A]' : 'bg-[#FAEEDA] border-[#EF9F27]'}`}>
                  <p className="text-xs text-gray-700 uppercase font-bold mb-1">Monthly gap</p>
                  <p className={`text-xl font-bold ${gap === 0 ? 'text-[#1D9E75]' : gap > 5000 ? 'text-[#A32D2D]' : 'text-[#854F0B]'}`}>
                    {gap === 0 ? "You are on track!" : `₹${gap.toLocaleString()}`}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${timeHorizon === 'short' ? 'bg-blue-100 text-blue-700' : timeHorizon === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-[#E1F5EE] text-[#1D9E75]'}`}>
                  {timeHorizon === "short" ? "Short-term goal — under 12 months" : timeHorizon === "medium" ? "Medium-term goal — 1-3 years" : "Long-term goal — 3+ years"}
                </span>
              </div>

              {cuttable.length > 0 && gap > 0 && (
                <div className="pt-4">
                  <p className="text-xs uppercase text-gray-500 font-bold mb-3">Where to find the extra ₹</p>
                  <div className="space-y-3">
                    {cuttable.map(c => (
                      <div key={c.category} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div>
                          <p className="font-bold text-[#1d3557] text-sm">{c.category} <span className="text-orange-500 ml-2">Cut by ₹{c.suggestedCut.toLocaleString()}</span></p>
                          <p className="text-xs text-gray-500 mt-1">{c.reasoning}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#0a192f]">₹{c.newAmount.toLocaleString()}/month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeOptions.length > 0 && (
                <div className="pt-4">
                  <p className="text-xs uppercase text-gray-500 font-bold mb-3">Recommended investment options for this goal</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeOptions.map((opt, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
                        <div className="mb-2">
                          <p className="font-bold text-[#1d3557] text-sm">{opt.name}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${opt.riskBg} ${opt.riskColor}`}>
                            {opt.riskLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-4 flex-1">{opt.description}</p>
                        <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 p-2 rounded-lg">
                          <div>
                            <p className="text-[9px] uppercase text-gray-500 font-bold">Worst case</p>
                            <p className="text-xs text-red-500 font-bold mt-0.5">{opt.annualReturnWorstCase}%</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">₹{opt.finalAmountWorstCase.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase text-gray-500 font-bold">Average case</p>
                            <p className="text-xs text-[#1d3557] font-bold mt-0.5">{opt.annualReturnAvgCase}%</p>
                            <p className="text-[10px] text-[#1d3557] font-bold mt-0.5">₹{opt.finalAmountAvgCase.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase text-gray-500 font-bold">Best case</p>
                            <p className="text-xs text-green-600 font-bold mt-0.5">{opt.annualReturnBestCase}%</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">₹{opt.finalAmountBestCase.toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-teal-600 font-bold mb-1">Min ₹{opt.minMonthlyAmount}/month to start</p>
                        <p className="text-[9px] text-gray-400 mb-3">{opt.taxNote}</p>
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-[10px] text-gray-500 leading-tight">{opt.howToStart}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!aiSuggestion && !aiLoading && gap > 0 && (
                <button
                  type="button"
                  onClick={handleGetAiSuggestion}
                  className="w-full mt-4 bg-[#0a192f] text-[#64ffda] py-3 rounded-xl text-sm font-bold shadow-sm hover:opacity-95 transition-opacity"
                >
                  Get personalised AI advice for this goal
                </button>
              )}
              {aiLoading && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              )}
              {aiSuggestion && (
                <div className="mt-4 p-5 bg-[#E1F5EE] border-l-4 border-[#1D9E75] rounded-r-xl shadow-sm">
                  <p className="text-[#0a192f] text-sm leading-relaxed">{aiSuggestion}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSaveGoal}
              className="bg-[#0a192f] text-[#64ffda] px-6 py-3 rounded-xl font-bold shadow-md hover:bg-opacity-90 disabled:opacity-50"
              disabled={!goalName.trim() || targetAmount <= 0 || targetMonths <= 0}
            >
              Save Goal
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 && !showAddForm ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-white">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-bold text-[#1d3557] text-lg mb-2">No goals set yet</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">Setting a specific goal with a timeline is the easiest way to start saving money systematically.</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-[#0a192f] text-[#64ffda] px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            Add your first goal
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-50 bg-[#f8f9fc] px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1d3557] text-lg">{goal.name}</h3>
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    Target: ₹{goal.targetAmount.toLocaleString()}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      goal.riskPreference === 'safe' ? 'bg-green-100 text-green-700' :
                      goal.riskPreference === 'aggressive' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {goal.riskPreference === 'safe' ? 'Safe' : goal.riskPreference === 'aggressive' ? 'Aggressive' : 'Moderate'}
                    </span>
                  </p>
                </div>
                <button 
                  onClick={() => handleRemoveGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="relative pt-6 pb-2">
                  {/* Timeline track */}
                  <div className="absolute top-8 left-0 right-0 h-1 bg-gray-100 rounded-full"></div>
                  
                  {/* Milestones */}
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center -translate-x-1/2">
                      <div className="w-5 h-5 rounded-full bg-[#0a192f] border-4 border-white shadow-sm flex items-center justify-center relative z-10"></div>
                      <p className="text-[10px] font-bold text-gray-400 mt-2">Start</p>
                      <p className="text-[10px] font-bold text-gray-400">₹0</p>
                    </div>
                    
                    {getMilestones(goal.targetAmount, goal.targetMonths, goal.monthlySavingsNeeded).map((m, i) => (
                      <div key={i} className={`flex flex-col items-center ${i === 3 ? 'translate-x-1/2' : ''}`}>
                        <div className="w-5 h-5 rounded-full bg-[#0a192f] border-4 border-white shadow-sm flex items-center justify-center relative z-10 text-[8px] text-white font-bold"></div>
                        <p className="text-[10px] font-bold text-[#1d3557] mt-2">M{m.month}</p>
                        <p className="text-[10px] font-bold text-[#0a192f]">₹{m.targetSaved.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between bg-[#f8f9fc] rounded-lg p-4">
                  <p className="text-sm font-bold text-[#1d3557] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    Save ₹{goal.monthlySavingsNeeded.toLocaleString()} per month
                  </p>
                  <p className="text-sm font-bold text-[#1d3557] flex items-center gap-2 mt-2 sm:mt-0">
                    📅 Reach your goal by Month {goal.targetMonths}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}