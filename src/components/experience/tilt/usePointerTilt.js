'use client';

import { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function usePointerTilt({ maxTilt = 10, depth = 10 } = {}) {
  const reducedMotion = useReducedMotion();
  const frameRef = useRef(null);
  const [state, setState] = useState({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    shiftX: 0,
    shiftY: 0,
    isActive: false
  });

  const updateFromPointer = useCallback(
    (event) => {
      if (reducedMotion) return;
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      const shiftX = (px - 0.5) * depth;
      const shiftY = (py - 0.5) * depth;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setState((prev) => ({
          ...prev,
          rotateX,
          rotateY,
          glowX: px * 100,
          glowY: py * 100,
          shiftX,
          shiftY
        }));
      });
    },
    [depth, maxTilt, reducedMotion]
  );

  const onPointerMove = useCallback((event) => updateFromPointer(event), [updateFromPointer]);
  const onPointerEnter = useCallback(() => setState((prev) => ({ ...prev, isActive: true })), []);
  const onPointerLeave = useCallback(() => {
    setState((prev) => ({ ...prev, rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, shiftX: 0, shiftY: 0, isActive: false }));
  }, []);

  return { state, onPointerMove, onPointerEnter, onPointerLeave, reducedMotion };
}
