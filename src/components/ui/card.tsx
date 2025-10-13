import { twMerge } from 'tailwind-merge';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-3xl border border-zinc-800/70 bg-zinc-950/60 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur',
        className
      )}
      {...props}
    />
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={twMerge('mb-4 flex flex-col gap-2', className)} {...props} />
  );
}

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={twMerge('text-lg font-semibold text-white', className)}
      {...props}
    />
  );
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={twMerge('text-sm text-zinc-300', className)} {...props} />;
}
