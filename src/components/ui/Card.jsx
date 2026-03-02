import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <article className={cn('rounded-xl border border-mist bg-white shadow-soft', className)} {...props}>
      {children}
    </article>
  );
}
