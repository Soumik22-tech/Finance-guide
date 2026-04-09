"use client";

import React, { useState } from "react";
import { askGemini } from "@/app/lib/gemini";
import { matchSchemes, SchemeMatch } from "@/app/lib/schemeMatcher";
import { BudgetResult } from "@/app/types/budget";

interface Props {
  result: BudgetResult;
}

export default function GovtSchemeMatcher({ result }: Props) {
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [aiExplainer, setAiExplainer] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);

  const matches = matchSchemes(
    result.salary,
    result.city,
    result.members,
    result.children,
    result.kids,
    result.house,
    result.maritalStatus
  );

  const displayMatches = showAll ? matches : matches.slice(0, 4);

  const handleExplain = async (schemeName: string) => {
    setAiLoading(true);
    setAiExplainer("");
    const prompt = `Explain the government scheme called ${schemeName} to someone who earns ₹${result.salary} per month in ${result.city} in simple everyday language.
Tell them:

In one sentence what this scheme gives them
Exactly how much money or benefit they can get in rupees
The single most important step to apply today

Rules: No government jargon. Write like explaining to a friend. Under 60 words total. Use rupee amounts.`;
    
    try {
      const resp = await askGemini(prompt);
      setAiExplainer(resp);
    } catch {
      setAiExplainer("Could not generate explanation.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1d3557] flex items-center gap-2">
            🇮🇳 Government Schemes You Qualify For
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Based on your income, family, and city — these schemes could benefit you directly.
          </p>
        </div>
        <span className="bg-[#E1F5EE] text-[#0F6E56] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
          {matches.length} schemes found
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">
            No specific schemes matched your profile. You may still be eligible for general schemes — visit india.gov.in for a complete list.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayMatches.map(({ scheme, matchReasons, priorityTag }) => {
            const isExpanded = expandedSchemeId === scheme.id;

            return (
              <div key={scheme.id} className="bg-[#f1f6ff] rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${scheme.categoryBg} ${scheme.categoryColor}`}>
                        {scheme.categoryLabel}
                      </span>
                      {priorityTag === "Highly Recommended" && (
                        <span className="bg-[#0a192f] text-[#64ffda] px-2 py-0.5 rounded text-[10px] font-bold">
                          Highly Recommended
                        </span>
                      )}
                      {priorityTag === "Recommended" && (
                        <span className="border border-teal-500 text-teal-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#1d3557]">{scheme.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{scheme.fullName}</p>
                  </div>

                  <div className="bg-[#E1F5EE] p-3 rounded-lg border border-[#caefe1] mb-4">
                    <p className="font-bold text-[#0F6E56] text-sm">{scheme.keyBenefit}</p>
                    {scheme.maxBenefitAmount && (
                      <p className="text-xs text-[#0F6E56] opacity-80 mt-1">
                        Worth up to ₹{scheme.maxBenefitAmount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <p className={`text-sm text-gray-600 mb-4 ${!isExpanded && 'line-clamp-2'}`}>
                    {scheme.description}
                  </p>

                  <div className="mb-4">
                    {matchReasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-2 mt-1">
                        <span className="text-green-500 text-xs">✓</span>
                        <span className="text-xs text-gray-600">{reason}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                    className="text-[#0a192f] text-sm font-bold hover:underline"
                  >
                    {isExpanded ? "Hide details" : "View details + how to apply"}
                  </button>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
                      <div className="mb-4">
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">How to Apply</h4>
                        <p className="text-sm text-[#1d3557]">{scheme.howToApply}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Documents Needed</h4>
                        <ul className="list-disc list-inside text-sm text-[#1d3557] pl-4">
                          {scheme.documentsNeeded.map((doc: string, i: number) => (
                            <li key={i}>{doc}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <a 
                          href={scheme.officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0a192f] text-[#64ffda] px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 inline-block text-center"
                        >
                          Visit Official Website →
                        </a>

                        <button
                          onClick={() => handleExplain(scheme.fullName)}
                          className="text-[#0F6E56] text-sm font-semibold hover:underline flex items-center gap-1"
                        >
                          ✨ Explain this scheme in simple words
                        </button>
                      </div>

                      {(aiLoading || aiExplainer) && isExpanded && (
                        <div className="mt-6 bg-[#E1F5EE] border-l-4 border-[#1D9E75] rounded-r-xl p-5 shadow-sm">
                          {aiLoading ? (
                            <div className="animate-pulse space-y-2">
                              <div className="h-4 bg-[#caefe1] rounded w-3/4"></div>
                              <div className="h-4 bg-[#caefe1] rounded w-1/2"></div>
                            </div>
                          ) : (
                            <p className="text-[#0a192f] text-sm leading-relaxed">{aiExplainer}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {matches.length > 4 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-4 py-3 bg-white border border-gray-200 text-[#1d3557] font-bold rounded-xl shadow-sm hover:bg-gray-50"
        >
          Show all {matches.length} schemes
        </button>
      )}
    </div>
  );
}