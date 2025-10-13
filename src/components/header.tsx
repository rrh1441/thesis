import Link from 'next/link';

export function Header() {
  return (
    <header className="relative z-10 border-b border-zinc-900/80 bg-black/40 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/20 font-mono text-green-400">
            Ƭ
          </span>
          Thesis
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="#community" className="hover:text-white">
            Community theses
          </Link>
          <Link href="#how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link href="#faq" className="hover:text-white">
            FAQ
          </Link>
        </nav>
        <span className="hidden text-xs font-medium uppercase tracking-[0.3em] text-zinc-600 md:inline">
          Live trading coming soon
        </span>
      </div>
    </header>
  );
}
