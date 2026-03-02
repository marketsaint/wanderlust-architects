'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

type SceneContainerProps = {
  sceneKey: string;
  reducedMotion: boolean;
  mode: 'calm' | 'active';
  children: ReactNode;
};

export function SceneContainer({ sceneKey, reducedMotion, mode, children }: SceneContainerProps) {
  const cinematic = mode === 'active' && !reducedMotion;
  const duration = mode === 'calm' ? 0.28 : 0.42;

  return (
    <div className='relative h-full overflow-hidden rounded-xl border border-white/15 bg-black/40'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={sceneKey}
          initial={false}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={cinematic ? { opacity: 0, y: -18, scale: 1.012, filter: 'blur(5px)' } : { opacity: 1 }}
          transition={{ duration: cinematic ? duration : 0, ease: [0.22, 1, 0.36, 1] }}
          className='absolute inset-0'
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {cinematic ? (
        <motion.div
          key={`fade-${sceneKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className='pointer-events-none absolute inset-0 bg-black'
        />
      ) : null}
    </div>
  );
}
