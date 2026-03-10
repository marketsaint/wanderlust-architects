'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

type RailProject = {
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  category: string;
  location: string;
};

type HorizontalProjectsWithContentProps = {
  projects: RailProject[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const laneOffsets = [-90, 0, 90];

export function HorizontalProjectsWithContent({ projects }: HorizontalProjectsWithContentProps) {
  const reducedMotion = useReducedMotion();
  const railRef = useRef<HTMLElement | null>(null);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cardWidth = clamp(Math.round(viewport.width * 0.28), 280, 420);
  const cardHeight = clamp(Math.round(viewport.height * 0.62), 360, 560);
  const gap = clamp(Math.round(viewport.width * 0.022), 18, 44);
  const sidePad = clamp(Math.round(viewport.width * 0.06), 20, 120);
  const trackWidth = projects.length * cardWidth + Math.max(0, projects.length - 1) * gap + sidePad * 2;
  const maxShift = Math.max(trackWidth - viewport.width, 0);

  const sectionHeight = useMemo(() => {
    if (reducedMotion) return 'auto';
    return `${Math.max(260, projects.length * 36)}vh`;
  }, [projects.length, reducedMotion]);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start start', 'end end']
  });

  const trackX = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  return (
    <main className='bg-[#f6f6f6] text-[#111]'>
      <section
        ref={railRef}
        style={{ height: sectionHeight }}
        className='relative'
      >
        <div className='sticky top-0 h-screen overflow-hidden border-y border-black/10'>
          <div className='mx-auto flex h-full w-full flex-col justify-between px-2 py-5 md:px-4 lg:px-8'>
            <header className='flex flex-wrap items-end justify-between gap-3 border-b border-black/15 pb-3'>
              <div>
                <p className='text-[10px] uppercase tracking-[0.24em] text-black/55'>Projects</p>
                <h1 className='mt-1 text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl'>Images With Content</h1>
              </div>
              <p className='text-xs uppercase tracking-[0.16em] text-black/55'>Scroll down to move horizontally</p>
            </header>

            <div className='relative flex-1 overflow-hidden py-8'>
              <motion.div
                className='flex h-full items-center'
                style={
                  reducedMotion
                    ? { gap: `${gap}px`, paddingLeft: `${sidePad}px`, paddingRight: `${sidePad}px` }
                    : {
                        x: trackX,
                        gap: `${gap}px`,
                        paddingLeft: `${sidePad}px`,
                        paddingRight: `${sidePad}px`
                      }
                }
              >
                {projects.map((project, index) => (
                  <motion.article
                    key={project.slug}
                    className='group relative shrink-0 overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_14px_34px_rgba(0,0,0,0.16)]'
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      y: reducedMotion ? 0 : laneOffsets[index % laneOffsets.length]
                    }}
                    whileHover={reducedMotion ? undefined : { y: laneOffsets[index % laneOffsets.length] - 12, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 290, damping: 22 }}
                  >
                    <Link href={`/projects/${project.slug}`} className='absolute inset-0 z-20' aria-label={`Open ${project.title}`} />
                    <div className='relative h-[68%] overflow-hidden'>
                      <motion.div
                        className='absolute inset-0'
                        animate={reducedMotion ? undefined : { scale: [1, 1.035, 1], x: [0, 4, 0] }}
                        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                      >
                        <Image src={project.image} alt={project.title} fill sizes='(max-width: 768px) 82vw, (max-width: 1280px) 40vw, 24vw' className='object-cover' />
                      </motion.div>
                      <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />
                    </div>

                    <div className='relative z-10 flex h-[32%] flex-col justify-between p-4'>
                      <div>
                        <p className='text-[10px] uppercase tracking-[0.18em] text-black/55'>{project.category}</p>
                        <h2 className='mt-1 line-clamp-2 text-lg leading-tight'>{project.title}</h2>
                        <p className='mt-2 line-clamp-2 text-sm text-black/70'>{project.shortDescription}</p>
                      </div>
                      <p className='text-[11px] uppercase tracking-[0.14em] text-black/45'>{project.location}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

