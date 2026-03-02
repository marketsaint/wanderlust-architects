'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export function ExperienceLoader({ heroImage, visible = true }) {
  const reducedMotion = useReducedMotion();
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.3 : 0.55 }}
      className='fixed inset-0 z-[120] overflow-hidden bg-black text-white'
      role='status'
      aria-label='Loading experience'
    >
      <motion.div
        className='absolute inset-0'
        initial={reducedMotion ? false : { opacity: 0.2, scale: 1.01 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.1, delay: reducedMotion ? 0 : 0.9 }}
      >
        <Image src={heroImage} alt='Experience prelude' fill sizes='100vw' priority className='object-cover grayscale' />
      </motion.div>

      <div className='absolute inset-0 bg-black/50' />

      <div className='relative z-20 mx-auto grid h-full w-[min(86vw,780px)] place-content-center gap-8'>
        <svg viewBox='0 0 740 380' className='h-auto w-full'>
          <g stroke='#5b5b5b' strokeWidth='1' fill='none'>
            {[...Array(8)].map((_, i) => (
              <line key={`h-${i}`} x1='20' x2='720' y1={34 + i * 44} y2={34 + i * 44} />
            ))}
            {[...Array(11)].map((_, i) => (
              <line key={`v-${i}`} y1='20' y2='360' x1={30 + i * 64} x2={30 + i * 64} />
            ))}
          </g>

          <motion.path
            d='M124 272 L124 110 L432 110 L432 272 L344 272'
            stroke='#fff'
            strokeWidth='2'
            fill='none'
            initial={reducedMotion ? { opacity: 1 } : { pathLength: 0.01, opacity: 0.8 }}
            animate={reducedMotion ? { opacity: 1 } : { pathLength: 1, opacity: [0.8, 1, 0] }}
            transition={{ duration: reducedMotion ? 0 : 1.9, ease: 'easeInOut' }}
          />
          <motion.path
            d='M175 272 L175 214 L274 214 L274 272'
            stroke='#fff'
            strokeWidth='2'
            fill='none'
            initial={reducedMotion ? { opacity: 1 } : { pathLength: 0.01, opacity: 0.8 }}
            animate={reducedMotion ? { opacity: 1 } : { pathLength: 1, opacity: [0.8, 1, 0] }}
            transition={{ duration: reducedMotion ? 0 : 1.9, ease: 'easeInOut', delay: 0.24 }}
          />
          <motion.path
            d='M306 272 L306 192 L402 192 L402 272'
            stroke='#d8d8d8'
            strokeWidth='2'
            fill='none'
            initial={reducedMotion ? { opacity: 1 } : { pathLength: 0.01, opacity: 0.75 }}
            animate={reducedMotion ? { opacity: 1 } : { pathLength: 1, opacity: [0.8, 1, 0] }}
            transition={{ duration: reducedMotion ? 0 : 1.9, ease: 'easeInOut', delay: 0.45 }}
          />
        </svg>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: reducedMotion ? 0.5 : 2.35, ease: 'easeInOut' }}
          className='h-[1px] bg-white/80'
        />
        <p className='text-xs uppercase tracking-[0.24em] text-neutral-300'>Drafting to render...</p>
      </div>

      <motion.div
        initial={false}
        animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.01, 1] }}
        transition={reducedMotion ? undefined : { duration: 0.35, delay: 2.2 }}
        className='absolute inset-0'
      />
    </motion.div>
  );
}

