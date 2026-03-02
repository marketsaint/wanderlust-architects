'use client';

import { useEffect } from 'react';
import { DomeGallery } from '@/components/experience/DomeGallery';

type WatchDomeItem = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

type WatchDomeShellProps = {
  items: WatchDomeItem[];
};

export function WatchDomeShell({ items }: WatchDomeShellProps) {
  useEffect(() => {
    document.body.classList.add('watch-dome-page');
    return () => {
      document.body.classList.remove('watch-dome-page');
    };
  }, []);

  return (
    <div id='watch-dome-root' className='fixed inset-0 z-[90] h-screen w-screen overflow-hidden bg-black text-white'>
      <DomeGallery
        items={items}
        focusZoomEnabled
        focusZoom={1.55}
        focusFalloff={7.5}
        focusLift={60}
        focusMinScale={0.92}
        focusMaxScale={1.55}
      />
      <p className='pointer-events-none absolute bottom-4 left-4 z-20 text-[10px] uppercase tracking-[0.22em] text-white/70'>
        Drag to rotate · Tap to zoom · Esc to reset
      </p>
    </div>
  );
}
