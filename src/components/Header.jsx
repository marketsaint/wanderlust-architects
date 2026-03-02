"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { RegionSwitcher } from '@/components/RegionSwitcher';
import { BrandLogo } from '@/components/BrandLogo';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blogs' },
  { href: '/career', label: 'Career' },
  { href: '/contact', label: 'Contact' }
];

const HOME_PATHS = new Set(['/', '/india', '/dubai']);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.25 });
  const isHomeOverlay = HOME_PATHS.has(pathname);
  const useLightTheme = isHomeOverlay && isOverHero;

  const isActiveLink = (href) => {
    if (href === '/') {
      return HOME_PATHS.has(pathname);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHomeOverlay) {
      setIsOverHero(false);
      return;
    }

    const updateHeroState = () => {
      const hero = document.getElementById('home-hero');
      const headerHeight = headerRef.current?.offsetHeight ?? 96;

      if (!hero) {
        setIsOverHero(window.scrollY < 140);
        return;
      }

      const rect = hero.getBoundingClientRect();
      setIsOverHero(rect.top <= headerHeight && rect.bottom > headerHeight + 20);
    };

    updateHeroState();
    window.addEventListener('scroll', updateHeroState, { passive: true });
    window.addEventListener('resize', updateHeroState);

    return () => {
      window.removeEventListener('scroll', updateHeroState);
      window.removeEventListener('resize', updateHeroState);
    };
  }, [isHomeOverlay]);

  const desktopLinkClass = (href) =>
    cn(
      'rounded-full px-2.5 py-2 text-[10px] uppercase tracking-[0.14em] transition-colors',
      useLightTheme
        ? isActiveLink(href)
          ? 'bg-white/20 text-white'
          : 'text-white/82 hover:bg-white/20 hover:text-white'
        : isActiveLink(href)
          ? 'bg-black text-white'
          : 'text-black/70 hover:bg-black hover:text-white'
    );

  const mobileLinkClass = (href) =>
    cn(
      'rounded-full px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors',
      useLightTheme
        ? isActiveLink(href)
          ? 'bg-white/20 text-white'
          : 'text-white/85 hover:bg-white/20 hover:text-white'
        : isActiveLink(href)
          ? 'bg-black text-white'
          : 'text-black/75 hover:bg-black hover:text-white'
    );

  return (
    <header ref={headerRef} className={cn('z-50 pt-3 sm:pt-4', isHomeOverlay ? 'fixed inset-x-0 top-0' : 'sticky top-0')}>
      <motion.div className={cn('h-[2px] origin-left', useLightTheme ? 'bg-white/80' : 'bg-black/70')} style={{ scaleX }} />
      <Container className='relative'>
        <div
          className={cn(
            'flex min-h-[72px] items-center justify-between gap-3 rounded-[22px] px-3 py-3 backdrop-blur-xl sm:px-5',
            useLightTheme
              ? 'border border-white/24 bg-black/34 shadow-[0_16px_42px_rgba(0,0,0,0.38)]'
              : 'border border-black/15 bg-white/68 shadow-[0_14px_36px_rgba(0,0,0,0.14)]'
          )}
        >
          <Link href='/' prefetch={false} className='flex shrink-0 items-center pr-3 xl:pr-5' aria-label='Wanderlust Architects home'>
            <BrandLogo
              className='gap-2 sm:gap-3'
              iconClassName='h-9 w-auto sm:h-10'
              textClassName={cn('text-[10px] tracking-[0.18em] sm:text-xs', useLightTheme && 'text-white')}
              iconSrc={
                useLightTheme
                  ? '/branding/wanderlust_architects_logo-icon-White.png'
                  : '/branding/wanderlust_architects_logo-icon-Black.png'
              }
              priority
            />
          </Link>

          <button
            type='button'
            className={cn(
              'rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.22em] xl:hidden',
              useLightTheme
                ? 'border border-white/35 bg-white/12 text-white'
                : 'border border-black/20 bg-white/74 text-black/80'
            )}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls='mobile-nav'
            aria-label='Toggle menu'
          >
            Menu
          </button>

          <nav className='hidden items-center gap-2.5 xl:ml-3 2xl:gap-4 xl:flex' aria-label='Primary'>
            <div className='shrink-0'>
              <RegionSwitcher inverted={useLightTheme} />
            </div>
            {links.map((link) => (
              <Link key={link.href} href={link.href} prefetch={false} className={desktopLinkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            <Link
              href='/contact'
              prefetch={false}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition',
                useLightTheme
                  ? 'border border-white/35 bg-white/12 text-white hover:bg-white hover:text-black'
                  : 'border border-black/20 bg-white/78 text-black/80 hover:bg-black hover:text-white'
              )}
            >
              Start Project
            </Link>
          </nav>
        </div>

        <nav
          id='mobile-nav'
          className={cn(
            'mt-2 grid overflow-hidden transition-all duration-300 xl:hidden',
            open ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
          )}
          aria-label='Mobile'
        >
          <div
            className={cn(
              'rounded-[20px] p-4 backdrop-blur-xl',
              useLightTheme
                ? 'border border-white/24 bg-black/46 shadow-[0_16px_34px_rgba(0,0,0,0.42)]'
                : 'border border-black/15 bg-white/74 shadow-[0_12px_30px_rgba(0,0,0,0.12)]'
            )}
          >
            <div className='grid gap-3'>
              <RegionSwitcher inverted={useLightTheme} />
              {links.map((link) => (
                <Link key={link.href} href={link.href} prefetch={false} onClick={() => setOpen(false)} className={mobileLinkClass(link.href)}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
