import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={twMerge(
        'w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40',
        className
      )}
      {...props}
    />
  )
);

Input.displayName = 'Input';
