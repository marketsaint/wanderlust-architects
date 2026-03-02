'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

function deterministicMotes(count) {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    x: ((index * 13) % 100) + 2,
    y: ((index * 17) % 100) + 2,
    size: 2 + (index % 3),
    duration: 18 + (index % 6) * 4
  }));
}

export function AmbientWorld({ mode = 'active' }) {
  const reducedMotion = useReducedMotion();
  const rafRef = useRef(null);
  const calm = mode === 'calm';
  const motes = useMemo(() => deterministicMotes(calm ? 8 : 14), [calm]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--exp-cursor-x', '50%');
    root.style.setProperty('--exp-cursor-y', '50%');

    if (reducedMotion) return undefined;

    const handleMove = (event) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        root.style.setProperty('--exp-cursor-x', `${(event.clientX / window.innerWidth) * 100}%`);
        root.style.setProperty('--exp-cursor-y', `${(event.clientY / window.innerHeight) * 100}%`);
        rafRef.current = null;
      });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
      <motion.div
        className='absolute inset-0'
        animate={reducedMotion ? undefined : { backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={reducedMotion ? undefined : { duration: calm ? 40 : 26, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.65), transparent 34%), radial-gradient(circle at 82% 24%, rgba(255,255,255,0.38), transparent 42%), radial-gradient(circle at 45% 78%, rgba(0,0,0,0.08), transparent 36%)'
        }}
      />

      <div
        className='absolute inset-0 opacity-30'
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(0,0,0,0.02) 50%, transparent 50%), linear-gradient(90deg, rgba(0,0,0,0.02) 50%, transparent 50%)',
          backgroundSize: '3px 3px'
        }}
      />

      {!reducedMotion &&
        motes.map((mote) => (
          <motion.span
            key={mote.id}
            className='absolute rounded-full bg-black/20'
            style={{ width: mote.size, height: mote.size, left: `${mote.x}%`, top: `${mote.y}%` }}
            animate={{ x: [0, 16, -10, 0], y: [0, -12, 8, 0], opacity: [0.2, 0.5, 0.25, 0.2] }}
            transition={{ duration: mote.duration, repeat: Infinity, ease: 'easeInOut', delay: mote.id * 0.14 }}
          />
        ))}

      <div
        className='absolute inset-0'
        style={{
          background: reducedMotion
            ? 'radial-gradient(560px circle at 50% 45%, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%)'
            : 'radial-gradient(520px circle at var(--exp-cursor-x) var(--exp-cursor-y), rgba(255,255,255,0.28), rgba(255,255,255,0) 56%)'
        }}
      />
    </div>
  );
}

