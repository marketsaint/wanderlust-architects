'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MagneticButton } from '@/components/experience/tilt/MagneticButton';
import { ProjectShowcase3D } from '@/components/experience/ProjectShowcase3D';

export function SceneRail({ projects, heroImage, region, contact, mode = 'active' }) {
  const reducedMotion = useReducedMotion();
  const [activeScene, setActiveScene] = useState(0);
  const sceneRefs = useRef([]);

  const regionLine =
    region === 'AE'
      ? 'Dubai / UAE briefs demand speed without losing technical depth.'
      : region === 'IN'
        ? 'Jaipur / Rajasthan briefs demand context sensitivity and built precision.'
        : 'Each brief starts from constraints, then builds expressive clarity.';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const idx = Number((hit.target).dataset.sceneIndex);
        if (Number.isFinite(idx)) setActiveScene(idx);
      },
      { threshold: [0.4, 0.65], rootMargin: '-20% 0px -20% 0px' }
    );

    sceneRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const scenes = useMemo(
    () => [
      <div key='entry' className='relative h-full overflow-hidden rounded-2xl border border-mist bg-black text-white'>
        <Image src={heroImage} alt='Experience hero' fill priority sizes='100vw' className='object-cover opacity-45 grayscale' />
        <div className='absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/90' />
        <div className='relative z-20 flex h-full flex-col justify-end p-8 sm:p-10 lg:p-16'>
          <p className='text-xs uppercase tracking-[0.22em] text-silver'>Scene 01</p>
          <h1 className='mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-7xl'>Enter a reactive design system.</h1>
          <p className='mt-4 max-w-2xl text-sm text-silver sm:text-base'>{regionLine}</p>
          <MagneticButton as='a' href='#scene-2' mode={mode} className='mt-8 border-white/70 text-white hover:border-white hover:bg-white hover:text-black'>
            Enter Experience
          </MagneticButton>
        </div>
      </div>,

      <div key='blueprint' className='grid h-full rounded-2xl border border-mist bg-white lg:grid-cols-2'>
        <div id='scene-2' className='relative overflow-hidden border-b border-mist p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-12'>
          <svg viewBox='0 0 540 360' className='h-full w-full'>
            <g stroke='#595959' strokeWidth='1' fill='none'>
              {[...Array(8)].map((_, i) => (
                <line key={`h-${i}`} x1='20' x2='520' y1={30 + i * 40} y2={30 + i * 40} />
              ))}
              {[...Array(10)].map((_, i) => (
                <line key={`v-${i}`} y1='20' y2='340' x1={30 + i * 52} x2={30 + i * 52} />
              ))}
            </g>
            <motion.path
              d='M96 258 L96 98 L356 98 L356 258 L286 258'
              stroke='#111'
              strokeWidth='2'
              fill='none'
              initial={reducedMotion ? { opacity: 1 } : { pathLength: 0.05, opacity: 0.6 }}
              animate={reducedMotion ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 1.25, ease: 'easeInOut' }}
            />
            <motion.path
              d='M150 258 L150 208 L236 208 L236 258'
              stroke='#111'
              strokeWidth='2'
              fill='none'
              initial={reducedMotion ? { opacity: 1 } : { pathLength: 0.05, opacity: 0.6 }}
              animate={reducedMotion ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 1.25, ease: 'easeInOut', delay: 0.2 }}
            />
          </svg>
        </div>
        <div className='relative overflow-hidden p-6 sm:p-8 lg:p-0'>
          <motion.div
            className='absolute inset-0'
            initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={projects[1]?.image || heroImage} alt='Blueprint render transition' fill sizes='50vw' className='object-cover grayscale' />
          </motion.div>
          <div className='relative z-20 ml-auto mt-auto max-w-lg border border-mist bg-white/90 p-6 backdrop-blur'>
            <p className='text-xs uppercase tracking-[0.2em] text-iron'>Scene 02</p>
            <h2 className='mt-3 text-3xl leading-tight'>Blueprint intent transforms into rendered space.</h2>
          </div>
        </div>
      </div>,

      <div key='narrative' className='grid h-full rounded-2xl border border-mist bg-[#f7f7f7] p-6 sm:p-10'>
        <div className='my-auto space-y-8'>
          <p className='text-xs uppercase tracking-[0.22em] text-iron'>Scene 03</p>
          {[
            'Context is not decoration. It is the framework of decisions.',
            'Form is not style. It is performance made visible.',
            'Execution is not an afterthought. It is where trust is earned.'
          ].map((line, index) => (
            <motion.p
              key={line}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: activeScene === 2 ? 1 : 0.35, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : index * 0.1 }}
              className='max-w-4xl text-3xl leading-tight text-ink sm:text-5xl'
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>,

      <div key='showcase' className='h-full rounded-2xl border border-mist bg-[#f2f2f2] p-4 sm:p-6 lg:p-8'>
        <ProjectShowcase3D projects={projects} mode={mode} />
      </div>
    ],
    [activeScene, heroImage, mode, projects, reducedMotion, regionLine]
  );

  return (
    <section className='relative border-b border-mist'>
      <div className='sticky top-20 h-[calc(100svh-5rem)] px-4 py-4 sm:px-6 lg:px-10'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeScene}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -18, filter: 'blur(5px)' }}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className='h-full'
          >
            {scenes[activeScene]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='pointer-events-none -mt-[calc(100svh-5rem)]'>
        {[0, 1, 2, 3].map((idx) => (
          <section
            key={idx}
            data-scene-index={idx}
            ref={(node) => {
              sceneRefs.current[idx] = node;
            }}
            className='h-[105svh]'
            aria-hidden='true'
          />
        ))}
      </div>

      <section className='border-t border-mist bg-white'>
        <div className='mx-auto flex min-h-[62svh] max-w-[1100px] flex-col items-center justify-center gap-8 px-6 py-20 text-center sm:px-10'>
          <p className='text-4xl leading-tight sm:text-6xl'>Let&apos;s build something that outlives us.</p>
          <MagneticButton as='a' href={contact.whatsapp} mode={mode}>
            Start a Conversation
          </MagneticButton>
        </div>
      </section>
    </section>
  );
}

