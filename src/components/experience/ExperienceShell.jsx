'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll } from 'framer-motion';
import { AmbientWorld } from '@/components/experience/AmbientWorld';
import { ExperienceLoader } from '@/components/experience/ExperienceLoader';
import { SceneRail } from '@/components/experience/SceneRail';

export function ExperienceShell({ projects, region, heroImage, contact }) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('active');

  useEffect(() => {
    const storedMode = window.localStorage.getItem('experience_mode');
    if (storedMode === 'calm' || storedMode === 'active') setMode(storedMode);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('experience_mode', mode);
  }, [mode]);

  useEffect(() => {
    const seen = window.sessionStorage.getItem('experience_seen') === '1';
    if (!seen) {
      setShowIntro(true);
      const t = window.setTimeout(() => {
        setShowIntro(false);
        window.sessionStorage.setItem('experience_seen', '1');
      }, reducedMotion ? 700 : 2550);
      return () => window.clearTimeout(t);
    }
    setReady(true);
    return undefined;
  }, [reducedMotion]);

  useEffect(() => {
    if (!showIntro) setReady(true);
  }, [showIntro]);

  return (
    <div className='relative isolate overflow-x-clip bg-transparent'>
      <AmbientWorld mode={mode} />
      <motion.div className='fixed left-0 right-0 top-0 z-[108] h-[2px] origin-left bg-black' style={{ scaleX: scrollYProgress }} />

      <aside className='fixed right-4 top-24 z-[111] flex items-center gap-2 rounded-lg border border-mist bg-white/80 p-2 backdrop-blur'>
        <button
          type='button'
          onClick={() => setMode((m) => (m === 'active' ? 'calm' : 'active'))}
          className='rounded-md border border-mist px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-ink hover:border-ink'
        >
          {mode === 'active' ? 'Active' : 'Calm'}
        </button>
        <button
          type='button'
          onClick={() => {
            setShowIntro(true);
            setTimeout(() => setShowIntro(false), reducedMotion ? 700 : 2550);
          }}
          className='rounded-md border border-mist px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-ink hover:border-ink'
        >
          Replay Intro
        </button>
      </aside>

      <AnimatePresence>{showIntro ? <ExperienceLoader heroImage={heroImage} visible /> : null}</AnimatePresence>

      {ready ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.5 }} className='relative z-10'>
          <SceneRail projects={projects} region={region} heroImage={heroImage} contact={contact} mode={mode} />
        </motion.div>
      ) : null}
    </div>
  );
}

