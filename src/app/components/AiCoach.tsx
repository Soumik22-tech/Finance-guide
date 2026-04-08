"use client";
import React, { useState, useRef, useEffect } from 'react';
import { BudgetResult } from '../types/budget';
import { askGemini } from '../lib/gemini';
import { Sparkles, Send } from 'lucide-react';

interface AiCoachProps {
  budgetResult: BudgetResult;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const quickQuestions = [
  "Why is my rent so high?",
  "How can I save more money?",
  "Explain my food budget",
  "How do I start investing?",
  "Am I spending too much?",
];

export default function AiCoach({ budgetResult }: AiCoachProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownMsg, setCooldownMsg] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (questionOverride?: string) => {
    const question = questionOverride ?? input.trim();
    if (!question || isLoading) return;

    setInput('');
    setIsLoading(true);
    setCooldownMsg('');

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', text: question }]);

    // Show cooldown notice to set expectations
    setCooldownMsg("⏱ AI is thinking... this may take 6–10 seconds on the free plan.");

    const systemPrompt = `
You are a friendly financial advisor helping ${budgetResult.name} from ${budgetResult.city}.
Their monthly salary is ₹${budgetResult.salary.toLocaleString()}.

Their current budget breakdown is:
${Object.entries(budgetResult.breakdown)
  .map(([k, v]) => `- ${k}: ₹${v.toLocaleString()} (${((v / budgetResult.salary) * 100).toFixed(1)}% of income)`)
  .join('\n')}

RULES for your response:
1. Answer in very simple, everyday language. No jargon.
2. Always reference their actual numbers from the breakdown above.
3. Keep answers under 120 words.
4. End every response with ONE concrete action they can take today.
5. Be warm, encouraging, and never judgmental about their financial situation.
6. If they are low income, be extra sensitive and suggest free or low-cost solutions.

User question: ${question}`;

    const response = await askGemini(systemPrompt);

    setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
    setCooldownMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mt-10 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Sparkles className="w-6 h-6 text-[#64ffda]" />
        <h3 className="text-xl font-bold text-[#1d3557]">Ask Your AI Financial Coach</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6 ml-9">Ask anything about your budget in simple words</p>

      {/* Chat Area */}
      <div className="bg-[#f8f9fc] rounded-xl border border-gray-100 p-4 mb-4 max-h-[400px] min-h-[120px] overflow-y-auto space-y-3">
        {messages.length === 0 && !isLoading && (
          <p className="text-center text-gray-400 text-sm py-8 italic">
            Your AI coach is ready. Ask a question below or tap a suggestion!
          </p>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#64ffda] text-[#0a192f] rounded-br-md font-medium'
                  : 'bg-[#f1f6ff] text-[#1d3557] rounded-bl-md border border-blue-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f1f6ff] text-[#1d3557] px-4 py-3 rounded-2xl rounded-bl-md border border-blue-100 text-sm">
              <span className="inline-flex items-center gap-1">
                Thinking
                <span className="animate-bounce [animation-delay:0ms]">.</span>
                <span className="animate-bounce [animation-delay:150ms]">.</span>
                <span className="animate-bounce [animation-delay:300ms]">.</span>
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {cooldownMsg && (
        <p className="px-4 py-2 text-xs text-[#0F6E56] italic">{cooldownMsg}</p>
      )}

      {/* Quick Question Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => !isLoading && handleSend(q)}
            disabled={isLoading}
            className={`text-xs px-3 py-1.5 bg-[#f1f6ff] text-[#1d3557] border border-blue-100 rounded-full hover:bg-[#64ffda] hover:text-[#0a192f] hover:border-[#64ffda] transition-all font-medium ${isLoading ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your budget..."
          disabled={isLoading}
          className="flex-1 bg-[#e8f0fe] rounded-xl px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-[#64ffda] transition text-[#1d3557] text-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`bg-[#0a192f] text-[#64ffda] font-bold px-5 py-3 rounded-xl hover:bg-[#112240] transition-all flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            "..."
          ) : (
            <>
              <Send className="w-4 h-4" />
              Ask
            </>
          )}
        </button>
      </form>
    </div>
  );
}
