"use client";

import { cn } from '@/lib/utils';

export function Tabs({ items, active, onChange }) {
  return (
    <div className='flex flex-wrap gap-2'>
      {items.map((item) => {
        const isActive = active === item;
        return (
          <button
            key={item}
            type='button'
            onClick={() => onChange(item)}
            className={cn(
              'rounded-md border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300',
              isActive ? 'border-ink bg-ink text-smoke' : 'border-mist bg-white text-iron hover:border-ink hover:text-ink'
            )}
            aria-pressed={isActive}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
