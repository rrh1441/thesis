import React, { useState } from 'react';
import { Sparkles, TrendingUp, FileText, Users, ChevronDown, Mail } from 'lucide-react';

export default function ThesisLanding() {
  const [belief, setBelief] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      q: "Is this real trading?",
      a: "No. Everything happens in a paper trading environment. We never connect to your brokerage or execute real trades."
    },
    {
      q: "Which models do you use?",
      a: "We use a combination of frontier LLMs to analyze your thesis, generate insights, and suggest aligned investment strategies."
    },
    {
      q: "Do I need brokerage access?",
      a: "Not at all. The entire experience is simulated. No API keys, no account linking, no real money."
    },
    {
      q: "How is my data stored?",
      a: "Your theses are private by default. You can optionally share anonymized versions with the community."
    }
  ];

  const communityTheses = [
    {
      author: "trader_47",
      summary: "Energy transition accelerates as battery tech improves",
      pl: "+$2,847",
      trades: 12,
      positive: true
    },
    {
      author: "macro_mind",
      summary: "Regional banking consolidation creates M&A opportunities",
      pl: "+$1,203",
      trades: 8,
      positive: true
    },
    {
      author: "tech_skeptic",
      summary: "AI infrastructure spending plateau incoming",
      pl: "-$892",
      trades: 15,
      positive: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F4F4F5] font-sans antialiased">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-radial from-[#4ADE80]/5 via-transparent to-transparent opacity-40" />
        
        <div className="max-w-4xl w-full relative z-10">
          <div className="space-y-8">
            {/* Main Input Interface */}
            <div className="space-y-6">
              {/* Input Group */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl lg:text-5xl font-light tracking-tight text-[#A1A1AA] whitespace-nowrap">
                    I think
                  </span>
                  <input
                    type="text"
                    value={belief}
                    onChange={(e) => setBelief(e.target.value)}
                    onFocus={() => setFocusedInput(true)}
                    onBlur={() => setFocusedInput(false)}
                    placeholder="the economy is going to get better"
                    className={`flex-1 bg-transparent border-b-2 ${
                      focusedInput ? 'border-[#4ADE80]' : 'border-[#27272A]'
                    } px-4 py-4 text-2xl lg:text-3xl font-light placeholder:text-[#3F3F46] focus:outline-none transition-all duration-300 ${
                      focusedInput ? 'shadow-[0_4px_20px_rgba(74,222,128,0.15)]' : ''
                    }`}
                  />
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col items-start gap-4">
                <button className="group bg-[#4ADE80] hover:bg-[#3DBD6E] text-[#050505] px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:shadow-[0_8px_30px_rgba(74,222,128,0.4)] hover:-translate-y-0.5 active:translate-y-0">
                  Turn beliefs into investments
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
                
                {/* Trust Line */}
                <p className="text-sm text-[#71717A] tracking-wide">
                  Paper trading only. No brokerage access required.
                </p>
              </div>
            </div>

            {/* Minimal accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent opacity-50 mt-16" />
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="px-6 py-24 border-t border-[#18181B]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-xl border border-[#18181B] hover:border-[#27272A] transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-[#4ADE80]/10 flex items-center justify-center mb-6 group-hover:bg-[#4ADE80]/20 transition-colors duration-300">
                <Sparkles className="w-6 h-6 text-[#4ADE80]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-3">AI Alignment</h3>
              <p className="text-[#A1A1AA] leading-relaxed">
                Describe your market view in plain language and let AI translate it into structured investment logic.
              </p>
            </div>

            <div className="group p-8 rounded-xl border border-[#18181B] hover:border-[#27272A] transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-[#4ADE80]/10 flex items-center justify-center mb-6 group-hover:bg-[#4ADE80]/20 transition-colors duration-300">
                <FileText className="w-6 h-6 text-[#4ADE80]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-3">Research Brief</h3>
              <p className="text-[#A1A1AA] leading-relaxed">
                Get a synthesized breakdown of sectors, tickers, and rationale aligned with your thesis.
              </p>
            </div>

            <div className="group p-8 rounded-xl border border-[#18181B] hover:border-[#27272A] transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-[#4ADE80]/10 flex items-center justify-center mb-6 group-hover:bg-[#4ADE80]/20 transition-colors duration-300">
                <TrendingUp className="w-6 h-6 text-[#4ADE80]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium mb-3">Paper Trades</h3>
              <p className="text-[#A1A1AA] leading-relaxed">
                Simulate trades based on your convictions without risking real capital or connecting accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Viz Strip */}
      <section className="px-6 py-24 border-t border-[#18181B]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Insights Preview */}
            <div className="p-8 rounded-xl border border-[#18181B] bg-gradient-to-br from-[#18181B]/50 to-transparent">
              <div className="text-xs uppercase tracking-wider text-[#71717A] mb-4">Generated Insights</div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mt-2" />
                  <p className="text-[#D4D4D8] leading-relaxed">
                    Rate-sensitive sectors show inverse correlation to Fed policy shifts
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mt-2" />
                  <p className="text-[#D4D4D8] leading-relaxed">
                    Consumer staples and utilities historically benefit from higher-for-longer environments
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mt-2" />
                  <p className="text-[#D4D4D8] leading-relaxed">
                    Recommended basket: defensive positioning with 60/40 equity-bond split
                  </p>
                </div>
              </div>
            </div>

            {/* Trade Card Preview */}
            <div className="p-8 rounded-xl border border-[#18181B] bg-gradient-to-br from-[#18181B]/50 to-transparent">
              <div className="text-xs uppercase tracking-wider text-[#71717A] mb-4">Paper Trade Panel</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                  <span className="text-[#D4D4D8] font-mono text-sm">XLU</span>
                  <span className="text-[#4ADE80] text-sm">+2.3%</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                  <span className="text-[#D4D4D8] font-mono text-sm">KO</span>
                  <span className="text-[#4ADE80] text-sm">+1.1%</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                  <span className="text-[#D4D4D8] font-mono text-sm">PG</span>
                  <span className="text-[#4ADE80] text-sm">+0.8%</span>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[#71717A] text-sm">Total P/L</span>
                  <span className="text-[#4ADE80] font-medium">+$1,247</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Snapshot */}
      <section className="px-6 py-24 border-t border-[#18181B]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-light">Community Theses</h2>
            <a href="#" className="text-[#4ADE80] text-sm hover:underline flex items-center gap-2">
              View more theses
              <span>→</span>
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {communityTheses.map((thesis, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-[#18181B] hover:border-[#27272A] transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#71717A]" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm text-[#71717A]">{thesis.author}</span>
                </div>
                
                <p className="text-[#D4D4D8] mb-6 leading-relaxed">{thesis.summary}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#18181B]">
                  <div className="text-sm text-[#71717A]">{thesis.trades} trades</div>
                  <div className={`text-sm font-medium ${thesis.positive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {thesis.pl}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 border-t border-[#18181B]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-light mb-12">Frequently Asked</h2>
          
          <div className="space-y-1">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-[#18181B] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#18181B]/50 transition-colors duration-200"
                >
                  <span className="text-left font-medium">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#71717A] transition-transform duration-200 ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-5 text-[#A1A1AA] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-24 border-t border-[#18181B]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-16">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl lg:text-3xl font-light tracking-tight text-[#A1A1AA] whitespace-nowrap">
                I think
              </span>
              <input
                type="text"
                placeholder="your next big thesis…"
                className="flex-1 bg-transparent border-b border-[#27272A] focus:border-[#4ADE80] px-4 py-3 text-xl lg:text-2xl font-light placeholder:text-[#3F3F46] focus:outline-none transition-colors duration-300"
              />
            </div>
            <button className="bg-[#4ADE80] hover:bg-[#3DBD6E] text-[#050505] px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-[0_8px_30px_rgba(74,222,128,0.4)]">
              Start testing
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-[#18181B]">
            <div className="flex flex-wrap items-center gap-6">
              <a href="#" className="text-sm text-[#71717A] hover:text-[#4ADE80] transition-colors duration-200">Docs</a>
              <a href="#" className="text-sm text-[#71717A] hover:text-[#4ADE80] transition-colors duration-200">API</a>
              <a href="#" className="text-sm text-[#71717A] hover:text-[#4ADE80] transition-colors duration-200">Privacy</a>
              <a href="#" className="text-sm text-[#71717A] hover:text-[#4ADE80] transition-colors duration-200">Contact</a>
            </div>
            <div className="text-xs text-[#52525B]">
              Paper trading only — not financial advice.
            </div> 
          </div>
        </div>
      </section>
    </div>
  );
}