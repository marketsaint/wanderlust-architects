'use client';

import { motion } from 'framer-motion';
import { useMagnetic } from '@/components/experience/tilt/useMagnetic';

export function MagneticButton({ as: Tag = 'button', mode = 'active', className = '', children, ...props }) {
  const intensity = mode === 'calm' ? 0.15 : 0.28;
  const { offset, onMove, onLeave, reducedMotion } = useMagnetic({ radius: 96, strength: intensity });

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={reducedMotion ? { x: 0, y: 0 } : { x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.55 }}
      className='inline-flex'
    >
      <Tag
        {...props}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors hover:text-smoke focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60 ${className}`}
      >
        <span className='absolute inset-0 -z-10 scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100' />
        <span>{children}</span>
        <span className='absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full' />
      </Tag>
    </motion.div>
  );
}
