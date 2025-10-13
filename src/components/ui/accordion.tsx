'use client';

import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type AccordionType = 'single';

interface AccordionContextValue {
  openValue: string | null;
  setOpenValue: (value: string | null) => void;
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
interface AccordionItemContextValue {
  value: string;
  id: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

interface AccordionProps {
  type?: AccordionType;
  collapsible?: boolean;
  className?: string;
}

export function Accordion({
  type = 'single',
  collapsible = false,
  className,
  children,
}: PropsWithChildren<AccordionProps>) {
  const [openValue, setOpenValue] = useState<string | null>(null);

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      openValue,
      setOpenValue: (value) => {
        if (type === 'single') {
          if (!collapsible && value === null) return;
          setOpenValue(value);
        }
      },
      collapsible,
    }),
    [openValue, type, collapsible]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  className?: string;
}

export function AccordionItem({
  value,
  className,
  children,
}: PropsWithChildren<AccordionItemProps>) {
  const itemId = useId();

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        id: itemId,
      }}
    >
      <div className={twMerge('rounded-2xl border border-zinc-900 bg-black/40', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  className?: string;
}

export function AccordionTrigger({
  className,
  children,
}: PropsWithChildren<AccordionTriggerProps>) {
  const context = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);

  if (!context) {
    throw new Error('AccordionTrigger must be used inside Accordion');
  }
  if (!itemValue) {
    throw new Error('AccordionTrigger must be used inside AccordionItem');
  }

  const isOpen = context.openValue === itemValue.value;

  const handleClick = () => {
    if (isOpen) {
      context.setOpenValue(context.collapsible ? null : itemValue.value);
    } else {
      context.setOpenValue(itemValue.value);
    }
  };

  return (
    <button
      type="button"
      id={itemValue.id}
      className={twMerge(
        'flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-base font-medium text-white transition-colors hover:text-green-400',
        className
      )}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-controls={`${itemValue.id}-content`}
    >
      <span>{children}</span>
      <ChevronDown
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180 text-green-400' : ''}`}
      />
    </button>
  );
}

interface AccordionContentProps {
  className?: string;
}

export function AccordionContent({
  className,
  children,
}: PropsWithChildren<AccordionContentProps>) {
  const context = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionContent must be used inside Accordion');
  }
  if (!itemValue) {
    throw new Error('AccordionContent must be used inside AccordionItem');
  }

  const isOpen = context.openValue === itemValue.value;

  return (
    <div
      id={`${itemValue.id}-content`}
      role="region"
      aria-labelledby={itemValue.id}
      className={twMerge(
        'grid overflow-hidden px-6 text-sm leading-relaxed text-zinc-400 transition-all',
        isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr] pb-0'
      )}
    >
      <div className={twMerge('overflow-hidden', className)}>{children}</div>
    </div>
  );
}
