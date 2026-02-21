"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { RegionSwitcher } from '@/components/RegionSwitcher';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/journal', label: 'Journal' },
  { href: '/career', label: 'Career' },
  { href: '/contact', label: 'Contact' }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.25 });

  return (
    <header className='sticky top-0 z-50 border-b border-mist/70 bg-smoke/95 backdrop-blur-xl'>
      <motion.div className='h-[2px] origin-left bg-black' style={{ scaleX }} />
      <Container className='flex h-20 items-center justify-between'>
        <Link href='/' prefetch={false} className='text-sm uppercase tracking-[0.3em]' aria-label='Wanderlust Architects home'>
          Wanderlust
        </Link>
        <button
          type='button'
          className='rounded-md border border-ink px-3 py-2 text-[10px] uppercase tracking-[0.22em] lg:hidden'
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls='mobile-nav'
          aria-label='Toggle menu'
        >
          Menu
        </button>
        <nav className='hidden items-center gap-7 lg:flex' aria-label='Primary'>
          <RegionSwitcher />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={cn(
                'relative text-xs uppercase tracking-[0.2em] text-iron transition-colors hover:text-ink',
                pathname === link.href && 'text-ink'
              )}
            >
              {link.label}
              {pathname === link.href ? <span className='absolute -bottom-2 left-0 h-px w-full bg-ink' /> : null}
            </Link>
          ))}
          <Link href='/contact' prefetch={false} className='rounded-md border border-ink px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
            Start Project
          </Link>
        </nav>
      </Container>
      <nav
        id='mobile-nav'
        className={cn('grid overflow-hidden border-t border-mist transition-all duration-300 lg:hidden', open ? 'max-h-96' : 'max-h-0')}
        aria-label='Mobile'
      >
        <Container className='py-4'>
          <div className='grid gap-3'>
            <RegionSwitcher />
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                className={cn('text-xs uppercase tracking-[0.2em] text-iron', pathname === link.href && 'text-ink')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </nav>
    </header>
  );
}
