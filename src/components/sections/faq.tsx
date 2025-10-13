import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'Is Thesis a real brokerage?',
    answer:
      'Today, Thesis is a paper-trading sandbox. You can simulate positions, track P/L, and share ideas without executing real trades. Live brokerage integrations are on the roadmap.',
  },
  {
    question: 'Which markets are supported?',
    answer:
      'The MVP focuses on US equities and ETFs. The AI model may reference other assets, but live quote coverage relies on Polygon or Finnhub for equities.',
  },
  {
    question: 'How reliable are the AI outputs?',
    answer:
      'We use OpenAI’s structured JSON mode with temperature controls and validation to reduce hallucinations. Always treat outputs as research starting points, not investment advice.',
  },
  {
    question: 'Can I export or share my theses?',
    answer:
      'Yes. Saved theses appear in your dashboard and the community feed. Social sharing cards are planned for the next release.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto mt-24 w-full max-w-3xl px-6 pb-24">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">FAQ</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Answers before you spin up your first thesis.
        </h2>
      </div>
      <Accordion type="single" collapsible className="space-y-4">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.question}
            value={item.question}
            className="overflow-hidden rounded-2xl border border-zinc-900 bg-black/40"
          >
            <AccordionTrigger className="px-6 py-4 text-left text-base font-medium text-white hover:text-green-400">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-sm leading-relaxed text-zinc-400">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
