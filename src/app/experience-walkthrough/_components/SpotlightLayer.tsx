'use client';

type SpotlightLayerProps = {
  enabled: boolean;
};

export function SpotlightLayer({ enabled }: SpotlightLayerProps) {
  return (
    <div
      className='pointer-events-none fixed inset-0 -z-10'
      style={{
        background: enabled
          ? 'radial-gradient(560px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.11), transparent 55%)'
          : 'radial-gradient(560px circle at 50% 50%, rgba(255,255,255,0.08), transparent 55%)'
      }}
    />
  );
}

