"use client";
import React, { useState } from 'react';
import { BudgetResult } from '../types/budget';
import { askGemini } from '../lib/gemini';
import { Map, Share2, CheckCircle } from 'lucide-react';

interface Props {
  budgetResult: BudgetResult;
  onRoadmapGenerated?: (roadmap: { title: string; body: string }[], goal: string) => void;
}

export default function PovertyEscapeRoadmap({ budgetResult, onRoadmapGenerated }: Props) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<{ title: string; body: string }[]>([]);
  const [goal, setGoal] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [waitMsg, setWaitMsg] = useState<string>("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(10);
    setWaitMsg("Building your personal plan... (free tier: ~10 seconds)");

    // Fake progress so user knows something is happening
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 85));
    }, 1000);

    const prompt = `
You are a financial advisor helping ${budgetResult.name} from ${budgetResult.city} escape financial stress.

Monthly salary: ₹${budgetResult.salary.toLocaleString()}
Current allocations:
${Object.entries(budgetResult.breakdown)
  .map(([k, v]) => `${k}: ₹${v.toLocaleString()}`)
  .join(", ")}

Create a realistic 6-month financial improvement roadmap for this person.
Format your response as exactly 6 items like this:

MONTH 1: [Short title]
[2-3 sentences: one specific action to take, what to cut, how much to save. Use their actual numbers. Simple language only.]

MONTH 2: [Short title]
[...]

MONTH 3: [Short title]
[...]

MONTH 4: [Short title]
[...]

MONTH 5: [Short title]
[...]

MONTH 6: [Short title]
[...]

GOAL: [One sentence final goal with a specific savings target in rupees]

Rules:
- Use their real salary and category amounts
- Suggest only free or very low-cost actions
- Be specific: say "cut food from ₹X to ₹Y" not "spend less on food"
- Keep each month under 60 words
- Simple everyday language, no jargon
`;

    const response = await askGemini(prompt);
    clearInterval(interval);
    setProgress(100);

    // Parse response into month cards
    const months: { title: string; body: string }[] = [];
    const lines = response.split("\n").filter((l) => l.trim() !== "");
    let currentMonth: { title: string; body: string } | null = null;

    for (const line of lines) {
      if (line.startsWith("MONTH ")) {
        if (currentMonth) months.push(currentMonth);
        const colonIdx = line.indexOf(":");
        currentMonth = {
          title: line.substring(colonIdx + 1).trim(),
          body: "",
        };
      } else if (line.startsWith("GOAL:")) {
        if (currentMonth) months.push(currentMonth);
        currentMonth = null;
        setGoal(line.replace("GOAL:", "").trim());
      } else if (currentMonth) {
        currentMonth.body += (currentMonth.body ? " " : "") + line.trim();
      }
    }

    setRoadmap(months);
    setIsGenerating(false);
    setWaitMsg("");

    if (onRoadmapGenerated) {
      onRoadmapGenerated(months, goal);
    }
  };

  return (
    <div className="border-l-4 border-[#0a192f] bg-white rounded-2xl shadow-lg p-6 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Map className="w-6 h-6 text-[#0a192f]" />
        <h3 className="text-xl font-bold text-[#1d3557]">Your Poverty Escape Roadmap</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-9">
        A step-by-step plan to build financial security
      </p>

      {/* Generate Button */}
      {roadmap.length === 0 && !isGenerating && (
        <button
          onClick={handleGenerate}
          className="bg-[#64ffda] text-[#0a192f] font-bold px-6 py-3 rounded-xl hover:bg-[#4dd3b3] transition-all shadow-md"
        >
          Generate My Roadmap
        </button>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-[#0a192f]">{waitMsg}</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-[#64ffda] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">{progress}% complete</p>
        </div>
      )}

      {/* Roadmap Cards */}
      {roadmap.length > 0 && !isGenerating && (
        <div className="mt-6 space-y-4">
          {roadmap.map((month, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-xl border border-gray-100 bg-[#f1f6ff] p-4"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0a192f] text-sm font-bold text-[#64ffda]">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-[#1d3557]">{month.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{month.body}</p>
              </div>
            </div>
          ))}

          {goal && (
            <div className="mt-4 rounded-xl bg-[#0a192f] p-4 text-center">
              <p className="text-sm font-semibold text-[#64ffda]">🎯 Your Goal</p>
              <p className="mt-1 text-sm text-white">{goal}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                const text = roadmap
                  .map((m, i) => `Month ${i + 1}: ${m.title}\n${m.body}`)
                  .join("\n\n") + (goal ? `\n\nGoal: ${goal}` : "");
                navigator.clipboard.writeText(text);
                alert("Roadmap copied to clipboard!");
              }}
              className="mt-2 w-full rounded-lg border border-[#0a192f] py-2 text-sm font-medium text-[#0a192f] hover:bg-gray-50"
            >
              Copy Roadmap
            </button>
            <button
              onClick={handleGenerate}
              className="mt-2 w-full bg-[#64ffda] text-[#0a192f] font-bold py-2 rounded-lg hover:bg-[#4dd3b3] transition text-sm"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
