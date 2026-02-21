"use client";

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const regions = [
  { value: 'india', label: 'India', href: '/' },
  { value: 'dubai', label: 'Dubai', href: '/dubai' }
];

export function RegionSelector({ className = '' }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentRegion = useMemo(() => {
    if (pathname?.startsWith('/dubai')) return 'dubai';
    return 'india';
  }, [pathname]);

  const [region, setRegion] = useState(currentRegion);

  useEffect(() => {
    setRegion(currentRegion);
  }, [currentRegion]);

  const onChange = (event) => {
    const next = event.target.value;
    setRegion(next);
    const target = regions.find((item) => item.value === next)?.href || '/';
    router.push(target);
  };

  return (
    <label className={`inline-flex items-center gap-2 ${className}`} aria-label='Choose region'>
      <span className='text-[10px] uppercase tracking-[0.18em] text-iron'>Region</span>
      <select
        value={region}
        onChange={onChange}
        className='rounded-md border border-mist bg-white px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-ink outline-none focus:border-ink'
        aria-label='Region selector'
      >
        {regions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
