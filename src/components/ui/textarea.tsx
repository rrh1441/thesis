import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={twMerge(
        'w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 text-base leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40',
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = 'Textarea';
