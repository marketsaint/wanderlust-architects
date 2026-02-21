import { cn } from '@/lib/utils';

export function Card({ className, children }) {
  return <article className={cn('rounded-xl border border-mist bg-white shadow-soft', className)}>{children}</article>;
}
