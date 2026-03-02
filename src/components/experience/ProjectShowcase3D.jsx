'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TiltCard } from '@/components/experience/tilt/TiltCard';

export function ProjectShowcase3D({ projects = [], mode = 'active' }) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const current = useMemo(() => projects[activeIndex] || projects[0], [activeIndex, projects]);

  const setActive = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const handleMove = (event) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: px * 10, y: py * 8 });
  };

  return (
    <div className='space-y-10'>
      <div
        className='grid gap-5 lg:grid-cols-[1.25fr_0.75fr]'
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') setActive((activeIndex + 1) % projects.length);
          if (event.key === 'ArrowUp') setActive((activeIndex - 1 + projects.length) % projects.length);
        }}
        tabIndex={0}
      >
        <div className='relative min-h-[440px] overflow-hidden rounded-xl border border-mist bg-black' onMouseMove={handleMove} onMouseLeave={() => setParallax({ x: 0, y: 0 })}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={current.slug}
              initial={reducedMotion ? false : { opacity: 0, x: direction > 0 ? 26 : -26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: direction > 0 ? -26 : 26 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className='absolute inset-0'
            >
              <motion.div style={reducedMotion ? undefined : { x: parallax.x, y: parallax.y }} className='absolute inset-[-3%]'>
                <Image src={current.image} alt={current.title} fill sizes='(max-width: 1024px) 100vw, 60vw' className='object-cover grayscale' />
              </motion.div>
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/12 to-transparent' />
              <div className='absolute inset-x-0 bottom-0 p-6 text-white'>
                <p className='text-xs uppercase tracking-[0.18em] text-silver'>{current.category}</p>
                <h3 className='mt-2 text-4xl leading-tight'>{current.title}</h3>
                <p className='mt-2 text-sm text-silver'>{current.location}</p>
                <Link href={`/projects/${current.slug}`} className='mt-4 inline-flex text-xs uppercase tracking-[0.2em] underline-offset-4 hover:underline'>
                  Open case
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className='rounded-xl border border-mist bg-white p-4'>
          <p className='mb-4 text-xs uppercase tracking-[0.22em] text-iron'>Gallery Spine</p>
          <div className='space-y-1'>
            {projects.slice(0, 10).map((project, index) => (
              <button
                key={project.slug}
                type='button'
                onMouseEnter={() => setActive(index)}
                onClick={() => setActive(index)}
                className={`block w-full rounded-md px-3 py-3 text-left transition-colors ${
                  index === activeIndex ? 'bg-ink text-smoke' : 'text-ink hover:bg-fog'
                }`}
              >
                <p className='text-xs uppercase tracking-[0.18em]'>{project.category}</p>
                <p className='mt-1 text-lg leading-tight'>{project.title}</p>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className='space-y-5'>
        <p className='text-xs uppercase tracking-[0.22em] text-iron'>Living Grid</p>
        <div className='grid auto-rows-[250px] grid-cols-12 gap-4 sm:auto-rows-[270px]'>
          {projects.slice(0, 12).map((project, index) => (
            <div key={`${project.slug}-${index}`} className={index % 4 === 0 ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-4'}>
              <TiltCard project={project} mode={mode} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

