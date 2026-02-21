import { cn } from '@/lib/utils';

export function Badge({ children, className }) {
  return <span className={cn('inline-flex border border-mist px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-iron', className)}>{children}</span>;
}
