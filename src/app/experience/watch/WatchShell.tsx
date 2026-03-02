'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WatchGrid } from '@/components/experience/watch/WatchGrid';
import { BrandLogo } from '@/components/BrandLogo';
import { RegionSwitcher } from '@/components/RegionSwitcher';

type WatchProject = {
  slug: string;
  title: string;
  image: string;
};

type WatchShellProps = {
  projects: WatchProject[];
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blogs' },
  { href: '/career', label: 'Career' },
  { href: '/contact', label: 'Contact' }
];

const HOME_PATHS = new Set(['/', '/india', '/dubai']);

export function WatchShell({ projects }: WatchShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return HOME_PATHS.has(pathname);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    document.body.classList.add('watch-grid-page');
    return () => {
      document.body.classList.remove('watch-grid-page');
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <main id='watch-grid-root' className='fixed inset-0 z-[95] h-screen w-screen overflow-hidden bg-white text-black'>
      <WatchGrid projects={projects} />

      <div className='pointer-events-none absolute inset-x-0 top-4 z-30 flex justify-center px-4'>
        <div className='pointer-events-auto w-full max-w-6xl'>
          <div className='flex items-center justify-between gap-2 rounded-[20px] border border-black/15 bg-white/68 px-3 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.14)] backdrop-blur-xl sm:gap-3 sm:px-4'>
            <Link href='/' className='min-w-0 max-w-[calc(100%-88px)] flex-1 shrink overflow-hidden px-1 py-1 xl:max-w-none' aria-label='Go to home page'>
              <BrandLogo
                className='min-w-0 gap-1.5 sm:gap-2'
                iconClassName='h-7 w-7 sm:h-8 sm:w-8'
                textClassName='max-[520px]:hidden truncate text-[8px] tracking-[0.08em] min-[420px]:text-[9px] min-[420px]:tracking-[0.11em] sm:text-[10px] sm:tracking-[0.14em]'
              />
            </Link>

            <button
              type='button'
              onClick={() => setMenuOpen((value) => !value)}
              className='shrink-0 rounded-full border border-black/20 bg-white/72 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/80 xl:hidden'
              aria-expanded={menuOpen}
              aria-controls='watch-mobile-nav'
              aria-label='Toggle navigation'
            >
              Menu
            </button>

            <nav className='hidden items-center gap-2 xl:flex' aria-label='Experience quick navigation'>
              <div className='shrink-0'>
                <RegionSwitcher />
              </div>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition ${
                    isActiveLink(item.href) ? 'bg-black text-white' : 'text-black/72 hover:bg-black hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href='/contact' className='rounded-full border border-black/15 bg-white/72 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-black/72 transition hover:bg-black hover:text-white'>
                Start Project
              </Link>
            </nav>
          </div>

          <nav
            id='watch-mobile-nav'
            className={`mt-2 overflow-hidden rounded-[18px] border border-black/15 bg-white/72 shadow-[0_10px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 xl:hidden ${
              menuOpen ? 'max-h-[440px] opacity-100' : 'max-h-0 border-transparent opacity-0'
            }`}
            aria-label='Mobile experience quick navigation'
          >
            <div className='grid gap-2 p-3'>
              <RegionSwitcher />
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition ${
                    isActiveLink(item.href) ? 'bg-black text-white' : 'text-black/75 hover:bg-black hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href='/contact' className='mt-1 rounded-full border border-black/15 bg-white/80 px-3 py-2 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-black/72 transition hover:bg-black hover:text-white'>
                Start Project
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </main>
  );
}
