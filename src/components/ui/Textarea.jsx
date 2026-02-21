import { cn } from '@/lib/utils';

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-md border border-silver bg-white px-4 py-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-iron focus:border-ink focus:ring-1 focus:ring-ink/50',
        props.className
      )}
    />
  );
}
