'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, FileText, Users, ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Is this real trading?',
    answer:
      'No. Everything happens in a paper trading environment. We never connect to your brokerage or execute real trades.',
  },
  {
    question: 'Which models do you use?',
    answer:
      'We use a combination of frontier LLMs to analyze your thesis, generate insights, and suggest aligned investment strategies.',
  },
  {
    question: 'Do I need brokerage access?',
    answer:
      'Not at all. The entire experience is simulated. No API keys, no account linking, no real money.',
  },
  {
    question: 'How is my data stored?',
    answer:
      'Your theses are private by default. You can optionally share anonymized versions with the community.',
  },
];

const COMMUNITY_THESES = [
  {
    author: 'trader_47',
    summary: 'Energy transition accelerates as battery tech improves',
    pnl: '+$2,847',
    trades: 12,
    positive: true,
  },
  {
    author: 'macro_mind',
    summary: 'Regional banking consolidation creates M&A opportunities',
    pnl: '+$1,203',
    trades: 8,
    positive: true,
  },
  {
    author: 'tech_skeptic',
    summary: 'AI infrastructure spending plateau incoming',
    pnl: '-$892',
    trades: 15,
    positive: false,
  },
];

export default function Home() {
  const router = useRouter();
  const [belief, setBelief] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [footerBelief, setFooterBelief] = useState('');

  const handleNavigate = useCallback(
    (value: string, shouldAutoSubmit: boolean) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      const params = new URLSearchParams({ prefill: trimmed });
      if (shouldAutoSubmit) {
        params.set('auto', '1');
      }

      router.push(`/simulate?${params.toString()}`);
    },
    [router]
  );

  const handleHeroSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleNavigate(belief, true);
    },
    [belief, handleNavigate]
  );

  const handleFooterSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleNavigate(footerBelief, true);
    },
    [footerBelief, handleNavigate]
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#F4F4F5] antialiased">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.05),_transparent_55%)]" />

        <div className="relative z-10 w-full max-w-4xl">
          <div className="space-y-8">
            {/* Input + CTA */}
          <form className="space-y-6" onSubmit={handleHeroSubmit} spellCheck={false}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-3">
                <span className="whitespace-nowrap text-3xl font-light tracking-tight text-[#A1A1AA] lg:text-5xl">
                  I think
                </span>
                <input
                  type="text"
                  value={belief}
                  onChange={(event) => setBelief(event.target.value)}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  placeholder="the economy is going to get better"
                  className={`flex-1 bg-transparent px-4 py-4 text-2xl font-light text-white outline-none transition-all duration-300 placeholder:text-[#3F3F46] lg:text-3xl ${
                    focusedInput
                      ? 'border-b-2 border-[#4ADE80] shadow-[0_4px_20px_rgba(74,222,128,0.15)]'
                      : 'border-b-2 border-[#27272A]'
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col items-start gap-4">
              <button
                  type="submit"
                  className="group rounded-lg bg-[#4ADE80] px-8 py-4 text-lg font-medium text-[#050505] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3DBD6E] hover:shadow-[0_8px_30px_rgba(74,222,128,0.4)]"
              >
                Turn beliefs into investments
                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
              <p className="text-sm tracking-wide text-[#71717A]">
                Paper trading only. No brokerage access required.
              </p>
            </div>
          </form>

            <div className="mt-16 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent opacity-50" />
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="border-t border-[#18181B] px-6 py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-3">
          <div className="group rounded-xl border border-[#18181B] p-8 transition-colors duration-300 hover:border-[#27272A]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#4ADE80]/10 text-[#4ADE80] transition-colors duration-300 group-hover:bg-[#4ADE80]/20">
              <Sparkles className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium">AI Alignment</h3>
            <p className="mt-3 leading-relaxed text-[#A1A1AA]">
              Describe your market view in plain language and let AI translate it into sectors, tickers, and conviction notes.
            </p>
          </div>
          <div className="group rounded-xl border border-[#18181B] p-8 transition-colors duration-300 hover:border-[#27272A]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#4ADE80]/10 text-[#4ADE80] transition-colors duration-300 group-hover:bg-[#4ADE80]/20">
              <FileText className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium">Research Brief</h3>
            <p className="mt-3 leading-relaxed text-[#A1A1AA]">
              Capture pros, cons, counter-theses, and historical analogs to pressure-test the idea before you save it.
            </p>
          </div>
          <div className="group rounded-xl border border-[#18181B] p-8 transition-colors duration-300 hover:border-[#27272A]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#4ADE80]/10 text-[#4ADE80] transition-colors duration-300 group-hover:bg-[#4ADE80]/20">
              <TrendingUp className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium">Paper Trades</h3>
            <p className="mt-3 leading-relaxed text-[#A1A1AA]">
              Size long/short positions, track P/L, and iterate your conviction with zero real capital at risk.
            </p>
          </div>
        </div>
      </section>

      {/* Alignment Preview */}
      <section className="border-t border-[#18181B] px-6 py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#3F3F46]">Alignment preview</p>
            <h2 className="text-3xl font-light">Your thesis turns into a structured playbook in seconds.</h2>
            <ul className="space-y-3 text-sm text-[#A1A1AA]">
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-2 w-2 rounded-full bg-[#4ADE80]" />
                Sectors most sensitive: Industrials · Financials · Regional banks
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-2 w-2 rounded-full bg-[#4ADE80]" />
                Suggested basket: Long KRE · Short XLF · Optional SPY hedge
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-2 w-2 rounded-full bg-[#4ADE80]" />
                Macro signals to watch: Rate spreads · CRE delinquency trendlines
              </li>
            </ul>
          </div>

          <div className="flex-1 rounded-3xl border border-[#18181B] bg-[#0b0b0d] p-8">
            <div className="flex items-center justify-between text-sm text-[#71717A]">
              <span>Paper trade tracker</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-[#18181B] bg-[#0F0F10] p-6 text-sm text-[#D4D4D8]">
                <p className="text-xs uppercase tracking-[0.35em] text-[#4ADE80]">Primary position</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-white">LONG KRE</span>
                  <span className="text-sm font-semibold text-[#4ADE80]">+$1,247</span>
                </div>
                <p className="mt-2 text-xs text-[#71717A]">Qty 500 @ $48.32 entry</p>
              </div>
              <div className="grid gap-3 text-sm text-[#A1A1AA] sm:grid-cols-2">
                <div className="rounded-xl border border-[#18181B] bg-[#0F0F10] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#3F3F46]">Counter thesis</p>
                  <p className="mt-2 leading-relaxed text-[#D4D4D8]">
                    CRE resilience undershoots expectations if regional banks secure fresh capital lines.
                  </p>
                </div>
                <div className="rounded-xl border border-[#18181B] bg-[#0F0F10] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#3F3F46]">Confidence notes</p>
                  <p className="mt-2 leading-relaxed text-[#D4D4D8]">
                    Watch Fed commentary and weekly deposit flows before scaling position sizing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Snapshot */}
      <section className="border-t border-[#18181B] px-6 py-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-2xl font-light">Community Theses</h2>
            <a
              href="/community"
              className="flex items-center gap-2 text-sm text-[#4ADE80] transition-colors duration-200 hover:underline"
            >
              View more theses
              <span>→</span>
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {COMMUNITY_THESES.map((thesis) => (
              <div
                key={thesis.summary}
                className="rounded-xl border border-[#18181B] p-6 transition-colors duration-300 hover:border-[#27272A]"
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27272A]">
                    <Users className="h-4 w-4 text-[#71717A]" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm text-[#71717A]">{thesis.author}</span>
                </div>
                <p className="mb-6 leading-relaxed text-[#D4D4D8]">{thesis.summary}</p>
                <div className="flex items-center justify-between border-t border-[#18181B] pt-4 text-sm">
                  <span className="text-[#71717A]">{thesis.trades} trades</span>
                  <span className={`font-medium ${thesis.positive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {thesis.pnl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#18181B] px-6 py-24">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-12 text-2xl font-light">Frequently Asked</h2>
          <div className="space-y-1">
            {FAQ_ITEMS.map((faq, index) => {
              const open = expandedFaq === index;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-lg border border-[#18181B] transition-colors duration-200 ${
                    open ? 'bg-[#18181B]/50' : 'bg-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(open ? null : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-medium text-[#E4E4E7] transition-colors duration-200 hover:bg-[#18181B]/60"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#71717A] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                      strokeWidth={1.5}
                    />
                  </button>
                  {open && <div className="px-6 pb-5 text-sm leading-relaxed text-[#A1A1AA]">{faq.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#18181B] px-6 py-24">
        <div className="mx-auto w-full max-w-4xl">
          <form className="mb-16 flex flex-col gap-4 lg:flex-row lg:items-center" onSubmit={handleFooterSubmit}>
            <div className="flex flex-1 items-center gap-3">
              <span className="whitespace-nowrap text-2xl font-light tracking-tight text-[#A1A1AA] lg:text-3xl">
                I think
              </span>
              <input
                type="text"
                value={footerBelief}
                onChange={(event) => setFooterBelief(event.target.value)}
                placeholder="your next big thesis…"
                className="flex-1 border-b border-[#27272A] bg-transparent px-4 py-3 text-xl font-light text-white outline-none transition-colors duration-300 placeholder:text-[#3F3F46] focus:border-[#4ADE80] lg:text-2xl"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#4ADE80] px-8 py-3 text-base font-medium text-[#050505] transition-all duration-200 hover:bg-[#3DBD6E] hover:shadow-[0_8px_30px_rgba(74,222,128,0.4)]"
            >
              Start testing
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-8 border-t border-[#18181B] pt-8 text-sm text-[#71717A]">
            <div className="flex flex-wrap items-center gap-6">
              <a href="#" className="transition-colors duration-200 hover:text-[#4ADE80]">
                Docs
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-[#4ADE80]">
                API
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-[#4ADE80]">
                Privacy
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-[#4ADE80]">
                Contact
              </a>
            </div>
            <div className="text-xs tracking-[0.3em] text-[#52525B] uppercase">
              Paper trading only — not financial advice.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
