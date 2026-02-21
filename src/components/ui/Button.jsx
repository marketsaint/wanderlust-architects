import Link from 'next/link';
import { cn } from '@/lib/utils';

const styles = {
  primary: 'bg-ink text-smoke border border-ink hover:bg-black hover:tracking-[0.26em]',
  ghost: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-smoke hover:tracking-[0.26em]',
  subtle: 'bg-white text-ink border border-mist hover:border-ink hover:bg-smoke'
};

export function Button({ href, variant = 'primary', className, children, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-xs uppercase tracking-[0.22em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/50',
    styles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
