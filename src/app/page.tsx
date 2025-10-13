import { Sparkles } from 'lucide-react';

import { ThesisWorkbench } from '@/components/thesis/thesis-workbench';
import { CommunityFeed } from '@/components/community/community-feed';
import { HowItWorks } from '@/components/sections/how-it-works';
import { FAQ } from '@/components/sections/faq';

export default function Home() {
  const exampleTheses = [
    {
      statement: 'AI will replace coders',
      implication: 'Long NVDA · Short IBM',
    },
    {
      statement: 'Rates will stay higher for longer',
      implication: 'Long XLF · Short QQQ',
    },
    {
      statement: 'Energy demand will surge in 2025',
      implication: 'Long XLE · Short TLT',
    },
  ];

  return (
    <div className="pb-24">
      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-20">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-green-500/40 bg-green-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-green-300">
            <Sparkles size={14} />
            Paper trading alpha
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
            Turn any “I think…” into investable moves — no brokerage account needed.
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            Thesis reads your belief, maps the knock-on effects, and spins up a paper
            portfolio so you can test the idea before exposing real capital.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {exampleTheses.map((example) => (
              <div
                key={example.statement}
                className="rounded-2xl border border-zinc-900 bg-zinc-950/40 px-4 py-4 text-sm text-zinc-300"
              >
                <p className="text-xs uppercase tracking-wide text-zinc-500">Community thesis</p>
                <p className="mt-2 font-medium text-white">
                  “{example.statement}”
                </p>
                <p className="mt-3 text-xs text-green-400">{example.implication}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ThesisWorkbench />
      <HowItWorks />
      <CommunityFeed />
      <FAQ />
    </div>
  );
}
