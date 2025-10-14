import { ThesisWorkbench } from '@/components/thesis/thesis-workbench';

export default function SimulatePage({
  searchParams,
}: {
  searchParams?: { prefill?: string | string[]; auto?: string | string[] };
}) {
  const rawPrefill = Array.isArray(searchParams?.prefill)
    ? searchParams?.prefill[0]
    : searchParams?.prefill;
  const initialThesis = rawPrefill?.trim() ?? '';
  const rawAuto = Array.isArray(searchParams?.auto)
    ? searchParams?.auto[0]
    : searchParams?.auto;
  const autoSubmit = rawAuto === '1' || rawAuto === 'true';

  return (
    <div className="min-h-screen bg-[#050505] text-[#F4F4F5]">
      <section id="thesis-workbench" className="mx-auto w-full max-w-6xl px-6 py-16">
        <ThesisWorkbench initialThesis={initialThesis} autoSubmit={autoSubmit} />
      </section>
    </div>
  );
}
