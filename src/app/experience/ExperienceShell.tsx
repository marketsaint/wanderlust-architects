'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { WalkthroughDOM } from './_components/WalkthroughDOM';
import type { RoomConfig } from './_data/rooms';

type ContactInfo = {
  phone: string;
  whatsapp: string;
  email: string;
};

type ExperienceShellProps = {
  rooms: RoomConfig[];
  contact: ContactInfo;
};

const DynamicWebGLCanvas = dynamic(() => import('./_webgl/WebGLCanvas'), { ssr: false });

type WebGLState = 'checking' | 'running' | 'fallback';

function checkWebGLAvailability(): { available: boolean; reason?: string } {
  if (typeof window === 'undefined') return { available: false, reason: 'server-render' };
  if (!window.WebGLRenderingContext) return { available: false, reason: 'WebGL unavailable' };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!context) {
    return { available: false, reason: 'WebGL unavailable' };
  }

  return { available: true };
}

export function ExperienceShell({ rooms, contact }: ExperienceShellProps) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [canUseWebGL, setCanUseWebGL] = useState(false);
  const [webglState, setWebglState] = useState<WebGLState>('checking');
  const [fallbackReason, setFallbackReason] = useState('');

  useEffect(() => {
    const result = checkWebGLAvailability();
    if (!result.available) {
      setCanUseWebGL(false);
      setWebglState('fallback');
      setFallbackReason(result.reason || 'WebGL unavailable');
      return;
    }

    setCanUseWebGL(true);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    node.style.setProperty('--mx', '50%');
    node.style.setProperty('--my', '50%');

    if (reducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (rafRef.current != null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
        const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
        node.style.setProperty('--mx', `${Math.max(0, Math.min(100, x))}%`);
        node.style.setProperty('--my', `${Math.max(0, Math.min(100, y))}%`);
        rafRef.current = null;
      });
    };

    node.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className='relative min-h-screen overflow-x-clip bg-black text-white [--mx:50%] [--my:50%]'>
      <div className='pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.09),transparent_52%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_56%)]' />
      <div
        className='pointer-events-none fixed inset-0 z-[2]'
        style={{
          background: reducedMotion
            ? 'radial-gradient(700px circle at 50% 50%, rgba(255,255,255,0.08), transparent 56%)'
            : 'radial-gradient(700px circle at var(--mx) var(--my), rgba(255,255,255,0.10), transparent 56%)'
        }}
      />

      {canUseWebGL ? (
        <DynamicWebGLCanvas
          rooms={rooms}
          onReady={() => {
            setWebglState('running');
            setFallbackReason('');
          }}
        />
      ) : null}

      <motion.div
        className='relative z-10'
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <WalkthroughDOM rooms={rooms} contact={contact} />
      </motion.div>

      {process.env.NODE_ENV === 'development' ? (
        <div className='pointer-events-none fixed bottom-3 right-3 z-50 rounded-md border border-white/20 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300'>
          {webglState === 'running' ? 'WebGL running' : `DOM fallback${fallbackReason ? `: ${fallbackReason}` : ''}`}
        </div>
      ) : null}
    </div>
  );
}
