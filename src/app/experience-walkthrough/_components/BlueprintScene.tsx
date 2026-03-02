'use client';

import { motion } from 'framer-motion';

type BlueprintSceneProps = {
  reducedMotion: boolean;
};

const paths = [
  { d: 'M96 470 L96 150 L526 150 L526 470', length: 920 },
  { d: 'M210 470 L210 312 L392 312 L392 470', length: 480 },
  { d: 'M332 150 L332 470', length: 320 },
  { d: 'M96 240 L526 240', length: 430 },
  { d: 'M96 350 L526 350', length: 430 }
];

export function BlueprintScene({ reducedMotion }: BlueprintSceneProps) {
  return (
    <section className='relative h-full bg-[#07090f]'>
      <div className='absolute inset-0 bg-[linear-gradient(rgba(90,120,180,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(90,120,180,0.12)_1px,transparent_1px)] bg-[size:36px_36px]' />
      <div className='absolute inset-0 bg-gradient-to-b from-[#111a2c]/35 to-transparent' />

      <div className='relative z-10 flex h-full flex-col justify-between p-8 sm:p-12'>
        <div>
          <p className='text-xs uppercase tracking-[0.24em] text-blue-200/70'>Scene 01</p>
          <h2 className='mt-3 text-4xl text-blue-100 sm:text-6xl'>Blueprint</h2>
          <p className='mt-2 text-sm uppercase tracking-[0.18em] text-blue-200/70'>Concept / Plan / Circulation</p>
        </div>

        <svg viewBox='0 0 620 520' className='mx-auto h-[58%] max-h-[500px] w-full max-w-4xl'>
          <g stroke='#7ca0db' fill='none' strokeWidth='2'>
            {paths.map((path, idx) => (
              <motion.path
                key={path.d}
                d={path.d}
                initial={reducedMotion ? { opacity: 1 } : { strokeDasharray: path.length, strokeDashoffset: path.length, opacity: 0.8 }}
                animate={reducedMotion ? { opacity: 1 } : { strokeDashoffset: 0, opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 1.1, delay: reducedMotion ? 0 : idx * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}

