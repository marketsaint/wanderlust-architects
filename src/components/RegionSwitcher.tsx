'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type RegionOption = {
  key: 'india' | 'dubai';
  label: 'India' | 'UAE';
  href: '/india' | '/dubai';
};

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const REGION_OPTIONS: RegionOption[] = [
  { key: 'india', label: 'India', href: '/india' },
  { key: 'dubai', label: 'UAE', href: '/dubai' }
];

function resolveActiveRegion(pathname: string): 'india' | 'dubai' {
  if (pathname.startsWith('/dubai')) return 'dubai';
  return 'india';
}

export function RegionSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const activeRegion = useMemo(() => resolveActiveRegion(pathname || '/'), [pathname]);

  const onSelect = (option: RegionOption) => {
    document.cookie = `site_region=${option.key}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
    router.push(option.href);
  };

  return (
    <div className='inline-flex items-center gap-1 rounded-full border border-mist bg-white p-1' aria-label='Region switcher' role='group'>
      {REGION_OPTIONS.map((option) => {
        const isActive = option.key === activeRegion;
        return (
          <button
            key={option.key}
            type='button'
            onClick={() => onSelect(option)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
              isActive ? 'bg-ink text-smoke' : 'text-iron hover:bg-fog'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

