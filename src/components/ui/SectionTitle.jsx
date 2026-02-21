import { cn } from '@/lib/utils';

export function SectionTitle({ eyebrow, title, description, align = 'left', className }) {
  return (
    <div className={cn('space-y-5', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className='h-px w-10 bg-silver' />
          <p className='text-[11px] uppercase tracking-[0.24em] text-iron'>{eyebrow}</p>
        </div>
      ) : null}
      <h2 className='text-3xl font-medium leading-[1.08] text-ink sm:text-5xl lg:text-6xl'>{title}</h2>
      {description ? <p className='max-w-2xl text-sm text-iron sm:text-base'>{description}</p> : null}
    </div>
  );
}
