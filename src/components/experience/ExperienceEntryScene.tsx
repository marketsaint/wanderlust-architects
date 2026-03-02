'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type Region = 'IN' | 'AE' | 'OTHER';

type ExperienceEntrySceneProps = {
  region: Region;
  heroImage: string;
};

export function ExperienceEntryScene({ region, heroImage }: ExperienceEntrySceneProps) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', reducedMotion ? '0%' : '12%']);

  const subheading =
    region === 'AE'
      ? 'A narrative for Dubai, UAE projects where luxury architecture meets delivery precision.'
      : region === 'IN'
        ? 'A narrative for Jaipur and Rajasthan projects where spatial intent is carried to execution.'
        : 'A narrative where architecture, interiors, and execution move in one deliberate line.';

  return (
    <section className='relative isolate min-h-[100svh] overflow-hidden border-b border-mist bg-ink text-smoke'>
      <motion.div className='absolute inset-0' style={reducedMotion ? undefined : { y: backgroundY }}>
        <Image src={heroImage} alt='Architectural entry scene' fill priority sizes='100vw' className='object-cover opacity-35 grayscale' />
      </motion.div>
      <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85' />
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        className='relative mx-auto flex min-h-[100svh] w-full max-w-[1600px] items-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24'
      >
        <div className='max-w-4xl space-y-6'>
          <p className='text-[11px] uppercase tracking-[0.28em] text-silver'>Signature Identity Experience</p>
          <h1 className='text-4xl leading-[1.02] sm:text-6xl lg:text-8xl'>Architecture is not built. It is revealed.</h1>
          <p className='max-w-2xl text-sm text-silver sm:text-base'>{subheading}</p>
          <a
            href='#chapter-context'
            className='inline-flex items-center justify-center rounded-md border border-white/65 px-6 py-3 text-xs uppercase tracking-[0.22em] text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
          >
            Enter the Studio
          </a>
        </div>
      </motion.div>
    </section>
  );
}

