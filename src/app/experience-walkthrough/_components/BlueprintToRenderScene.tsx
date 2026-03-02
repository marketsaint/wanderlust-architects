'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type BlueprintToRenderSceneProps = {
  reducedMotion: boolean;
  renderImage: string;
  bullets: string[];
};

const overlayPaths = [
  { d: 'M90 420 L90 120 L500 120 L500 420', length: 820 },
  { d: 'M180 420 L180 296 L360 296 L360 420', length: 420 },
  { d: 'M90 236 L500 236', length: 410 }
];

export function BlueprintToRenderScene({ reducedMotion, renderImage, bullets }: BlueprintToRenderSceneProps) {
  return (
    <section className='relative h-full bg-black'>
      <motion.div
        className='absolute inset-0'
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0.15, scale: 1.03 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={renderImage} alt='Blueprint to render transition' fill sizes='100vw' className='object-cover grayscale' />
      </motion.div>
      <div className='absolute inset-0 bg-black/45' />

      <motion.svg
        viewBox='0 0 620 500'
        className='absolute inset-0 m-auto h-[70%] w-[80%] max-w-5xl'
        initial={reducedMotion ? { opacity: 0.65 } : { opacity: 1, filter: 'blur(0px)' }}
        animate={reducedMotion ? { opacity: 0.65 } : { opacity: 0, filter: 'blur(3px)' }}
        transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.45 }}
      >
        <g stroke='#bdd0ef' fill='none' strokeWidth='2'>
          {overlayPaths.map((path, idx) => (
            <motion.path
              key={path.d}
              d={path.d}
              initial={reducedMotion ? { opacity: 1 } : { strokeDasharray: path.length, strokeDashoffset: path.length }}
              animate={reducedMotion ? { opacity: 1 } : { strokeDashoffset: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : idx * 0.1, ease: 'easeInOut' }}
            />
          ))}
        </g>
      </motion.svg>

      <div className='relative z-10 flex h-full items-end p-8 sm:p-12'>
        <div className='grid gap-3 rounded-md border border-white/20 bg-black/40 p-5 backdrop-blur md:grid-cols-3'>
          {bullets.map((bullet) => (
            <p key={bullet} className='text-xs uppercase tracking-[0.18em] text-zinc-200'>
              {bullet}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

