'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePointerTilt } from '@/components/experience/tilt/usePointerTilt';

export function TiltCard({ project, mode = 'active' }) {
  const calm = mode === 'calm';
  const { state, onPointerMove, onPointerEnter, onPointerLeave, reducedMotion } = usePointerTilt({
    maxTilt: calm ? 4 : 9,
    depth: calm ? 7 : 12
  });

  const interactive = !reducedMotion;
  const imgShift = interactive ? { x: state.shiftX * -0.45, y: state.shiftY * -0.45 } : undefined;
  const metaShift = interactive ? { x: state.shiftX * 0.2, y: state.shiftY * 0.2 } : undefined;

  return (
    <motion.article
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      whileTap={interactive ? { scale: 0.992 } : undefined}
      animate={
        interactive
          ? state.isActive
            ? { rotateX: state.rotateX, rotateY: state.rotateY, y: -6 }
            : { rotateX: 0, rotateY: 0, rotateZ: [0, 0.2, 0], y: [0, -1, 0] }
          : { rotateX: 0, rotateY: 0, y: 0 }
      }
      transition={
        state.isActive
          ? { type: 'spring', stiffness: 180, damping: 18, mass: 0.6 }
          : { duration: interactive && !calm ? 7.5 : 0, repeat: interactive && !calm ? Infinity : 0, ease: 'easeInOut' }
      }
      style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
      className='group relative h-full overflow-hidden rounded-xl border border-mist bg-white shadow-[0_14px_32px_rgba(0,0,0,0.08)]'
    >
      <div
        className='pointer-events-none absolute inset-0 z-[5]'
        style={{
          transform: 'translateZ(20px)',
          opacity: state.isActive ? 1 : 0.4,
          background: `linear-gradient(130deg, rgba(255,255,255,${state.isActive ? 0.2 : 0.1}), rgba(255,255,255,0) 42%), radial-gradient(420px circle at ${100 - state.glowX}% ${100 - state.glowY}%, rgba(255,255,255,0.24), rgba(255,255,255,0) 48%)`
        }}
      />

      <motion.div style={{ transform: 'translateZ(30px)', ...imgShift }} className='absolute inset-0'>
        <Image src={project.image} alt={project.title} fill sizes='(max-width: 768px) 100vw, 33vw' className='object-cover grayscale' />
      </motion.div>

      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/24 to-transparent' />

      <motion.div style={{ transform: 'translateZ(50px)' }} className='absolute inset-x-0 bottom-0 z-20 p-5 text-white'>
        <h3 className='text-2xl leading-tight'>{project.title}</h3>
        <motion.div style={metaShift} className='mt-2 space-y-1 text-xs uppercase tracking-[0.18em] text-silver'>
          <p style={{ transform: 'translateZ(40px)' }}>{project.location}</p>
          <p style={{ transform: 'translateZ(40px)' }}>{project.category}</p>
        </motion.div>
        <Link href={`/projects/${project.slug}`} className='mt-3 inline-flex text-xs uppercase tracking-[0.2em] text-white underline-offset-4 group-hover:underline'>
          Open case
        </Link>
      </motion.div>
    </motion.article>
  );
}

