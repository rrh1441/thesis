import { Lightbulb, ShieldCheck, Wallet } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STEPS = [
  {
    title: 'Tell Thesis what you believe',
    description:
      'Start with any “I think…” statement. We normalize your language and send it through structured prompts.',
    icon: Lightbulb,
  },
  {
    title: 'See investable implications',
    description:
      'Our AI maps your idea to sectors, tickers, and rationale, drawing on real market data and macro analogs.',
    icon: Wallet,
  },
  {
    title: 'Paper trade with zero risk',
    description:
      'Size long/short positions, monitor P/L, and iterate before ever connecting a real brokerage.',
    icon: ShieldCheck,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto mt-24 w-full max-w-6xl space-y-10 px-6 py-8"
    >
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Workflow</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          From rough belief to portfolio simulation in under a minute.
        </h2>
        <p className="mt-4 text-base text-zinc-400">
          Thesis is tuned for paper trading, so you can publish ideas, stress test them with
          community input, and gather evidence without touching user capital.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step) => (
          <Card key={step.title} className="border-zinc-900/80 bg-black/30">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                <step.icon size={22} />
              </div>
              <CardTitle className="text-lg text-white">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400">
              <p>{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
