import { twMerge } from 'tailwind-merge';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'positive' | 'negative';
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  const toneClasses = {
    neutral: 'bg-zinc-800 text-zinc-100',
    positive: 'bg-green-500/10 text-green-400 ring-1 ring-green-500/40',
    negative: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/40',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide',
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
