'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { WalkthroughScene } from './_data/scenes';
import { AmbientLayer } from './_components/AmbientLayer';
import { SpotlightLayer } from './_components/SpotlightLayer';
import { SceneContainer } from './_components/SceneContainer';
import { BlueprintScene } from './_components/BlueprintScene';
import { BlueprintToRenderScene } from './_components/BlueprintToRenderScene';
import { GalleryScene, type WalkProject } from './_components/GalleryScene';
import { FinalCTA } from './_components/FinalCTA';
import { rafThrottle } from './_components/rafThrottle';

type ContactInfo = {
  phone: string;
  whatsapp: string;
  email: string;
};

type ExperienceShellProps = {
  scenes: WalkthroughScene[];
  projects: WalkProject[];
  contact: ContactInfo;
};

export function ExperienceShell({ scenes, projects, contact }: ExperienceShellProps) {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep SSR and first client render identical to avoid hydration mismatch.
  const stableReducedMotion = mounted ? reducedMotion : false;
  const effectiveMode: 'active' | 'calm' = stableReducedMotion ? 'calm' : 'active';

  useEffect(() => {
    const root = rootRef.current;
    if (!root || stableReducedMotion || effectiveMode !== 'active') return;

    root.style.setProperty('--mx', '50%');
    root.style.setProperty('--my', '50%');

    const updatePointer = rafThrottle((event: PointerEvent) => {
      if (document.hidden) return;
      const rect = root.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      root.style.setProperty('--mx', `${Math.max(0, Math.min(100, x))}%`);
      root.style.setProperty('--my', `${Math.max(0, Math.min(100, y))}%`);
    });

    const onVisibility = () => {
      if (document.hidden) updatePointer.cancel();
    };

    root.addEventListener('pointermove', updatePointer as EventListener, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      root.removeEventListener('pointermove', updatePointer as EventListener);
      document.removeEventListener('visibilitychange', onVisibility);
      updatePointer.cancel();
    };
  }, [effectiveMode, stableReducedMotion]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.sceneIndex);
        if (!Number.isNaN(idx)) setActiveScene(idx);
      },
      { threshold: [0.4, 0.6], rootMargin: '-18% 0px -18% 0px' }
    );

    sectionRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateFromScroll = rafThrottle(() => {
      if (document.hidden) return;
      const centerY = window.innerHeight / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionRefs.current.forEach((node, idx) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - centerY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = idx;
        }
      });

      setActiveScene((prev) => (prev === closest ? prev : closest));
    });

    window.addEventListener('scroll', updateFromScroll as EventListener, { passive: true });
    window.addEventListener('resize', updateFromScroll as EventListener, { passive: true });
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', updateFromScroll as EventListener);
      window.removeEventListener('resize', updateFromScroll as EventListener);
      updateFromScroll.cancel();
    };
  }, []);

  const active = scenes[activeScene] ?? scenes[0];
  const commit = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local';

  const activeContent = useMemo(() => {
    if (active.type === 'intro') {
      return (
        <section className='flex h-full items-end bg-black p-8 sm:p-12'>
          <div className='space-y-5'>
            <p className='text-xs uppercase tracking-[0.24em] text-zinc-400'>Scene 00</p>
            <h1 className='max-w-5xl text-4xl leading-[1.04] sm:text-6xl lg:text-7xl'>{active.title}</h1>
            <p className='max-w-2xl text-sm text-zinc-300 sm:text-base'>{active.subtitle}</p>
            <p className='pt-2 text-xs uppercase tracking-[0.22em] text-zinc-500'>Scroll to begin</p>
          </div>
        </section>
      );
    }
    if (active.type === 'blueprint') {
      return <BlueprintScene reducedMotion={stableReducedMotion || effectiveMode === 'calm'} />;
    }
    if (active.type === 'transition') {
      return (
        <BlueprintToRenderScene
          reducedMotion={stableReducedMotion || effectiveMode === 'calm'}
          renderImage={active.renderImage || projects[0]?.image}
          bullets={active.bullets || []}
        />
      );
    }
    if (active.type === 'gallery') {
      return <GalleryScene projects={projects} reducedMotion={stableReducedMotion} mode={effectiveMode} />;
    }
    return <FinalCTA contact={contact} />;
  }, [active, contact, effectiveMode, projects, stableReducedMotion]);

  return (
    <div ref={rootRef} className='relative min-h-screen bg-black text-white [--mx:50%] [--my:50%]'>
      <AmbientLayer mode='active' reducedMotion={stableReducedMotion} />
      <SpotlightLayer enabled={effectiveMode === 'active' && !stableReducedMotion} />

      <motion.div className='fixed left-0 right-0 top-0 z-[120] h-[2px] origin-left bg-white/80' style={{ scaleX: scrollYProgress }} />

      <motion.div
        className='sticky top-20 z-20 h-[calc(100svh-5rem)] p-4 sm:p-6'
        initial={false}
        animate={mounted && !stableReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: mounted && !stableReducedMotion ? 0.35 : 0 }}
      >
        <AnimatePresence mode='wait'>
          <SceneContainer sceneKey={active.key} reducedMotion={stableReducedMotion} mode={effectiveMode}>
            {activeContent}
          </SceneContainer>
        </AnimatePresence>
      </motion.div>

      <div className='pointer-events-none -mt-[calc(100svh-5rem)]'>
        {scenes.map((scene, index) => (
          <section
            key={scene.key}
            data-scene-index={index}
            ref={(node) => {
              sectionRefs.current[index] = node;
            }}
            className='min-h-screen'
            aria-hidden='true'
          />
        ))}
      </div>

      <div className='pointer-events-none fixed bottom-3 right-3 z-50 text-xs opacity-60'>
        build: {commit}
      </div>
    </div>
  );
}
