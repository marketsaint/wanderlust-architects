'use client';

import { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useMagnetic({ radius = 84, strength = 0.24 } = {}) {
  const reducedMotion = useReducedMotion();
  const frameRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (event) => {
      if (reducedMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);
      if (distance > radius) return setOffset({ x: 0, y: 0 });

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setOffset({ x: dx * strength, y: dy * strength });
      });
    },
    [radius, strength, reducedMotion]
  );

  const onLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return { reducedMotion, offset, onMove, onLeave };
}
