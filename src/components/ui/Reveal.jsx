"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export function Reveal({ children, className = '', delay = 0, y = 26, depth = false }) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep SSR and first client render identical; apply reduced-motion preference after mount.
  const stableReducedMotion = mounted ? prefersReducedMotion : false;
  const initial = stableReducedMotion
    ? depth
      ? { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }
      : { opacity: 1, y: 0 }
    : depth
      ? { opacity: 0, y, rotateX: 13, scale: 0.985, filter: 'blur(2px)' }
      : { opacity: 0, y };

  const enter = depth
    ? { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }
    : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      style={depth ? { transformPerspective: 1400, transformStyle: 'preserve-3d' } : undefined}
      initial={initial}
      whileInView={enter}
      viewport={{ once: true, amount: 0.2 }}
      transition={stableReducedMotion ? { duration: 0 } : { duration: depth ? 0.82 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
