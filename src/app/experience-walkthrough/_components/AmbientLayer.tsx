'use client';

import type { CSSProperties } from 'react';

type AmbientLayerProps = {
  mode: 'calm' | 'active';
  reducedMotion: boolean;
};

export function AmbientLayer({ mode, reducedMotion }: AmbientLayerProps) {
  const showDust = !reducedMotion && mode === 'active';
  const motes = showDust ? 12 : 0;

  return (
    <>
      <div className='pointer-events-none fixed inset-0 -z-20 overflow-hidden'>
        <div className={`absolute inset-0 ${showDust ? 'animate-[ambientDrift_26s_linear_infinite]' : ''}`} />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_80%_26%,rgba(255,255,255,0.09),transparent_38%),radial-gradient(circle_at_52%_78%,rgba(255,255,255,0.04),transparent_42%)]' />

        {Array.from({ length: motes }).map((_, index) => (
          <span
            key={`dust-${index}`}
            className='absolute h-1 w-1 rounded-full bg-white/25 animate-[dustFloat_var(--dust-dur)_ease-in-out_infinite]'
            style={
              {
                left: `${8 + ((index * 17) % 84)}%`,
                top: `${12 + ((index * 13) % 78)}%`,
                ['--dust-dur' as string]: `${18 + (index % 5) * 4}s`,
                animationDelay: `${index * 0.2}s`
              } as CSSProperties
            }
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes ambientDrift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -1.2%, 0) scale(1.02);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes dustFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.15;
          }
          50% {
            transform: translate3d(8px, -14px, 0);
            opacity: 0.45;
          }
          100% {
            transform: translate3d(-4px, -24px, 0);
            opacity: 0.12;
          }
        }
      `}</style>
    </>
  );
}
