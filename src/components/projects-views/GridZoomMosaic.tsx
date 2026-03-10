'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMemo } from 'react';

type GridProject = {
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  category: string;
  location: string;
};

type GridZoomMosaicProps = {
  projects: GridProject[];
};

const desktopPattern = [
  'col-span-3 row-span-3',
  'col-span-4 row-span-4',
  'col-span-5 row-span-4',
  'col-span-3 row-span-4',
  'col-span-4 row-span-3',
  'col-span-5 row-span-3',
  'col-span-4 row-span-4',
  'col-span-3 row-span-3'
];

const mobilePattern = ['col-span-2 row-span-2', 'col-span-2 row-span-3', 'col-span-2 row-span-2', 'col-span-2 row-span-3'];

export function GridZoomMosaic({ projects }: GridZoomMosaicProps) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const zoom = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [1, 1.06, 1.14, 1.2]);
  const driftY = useTransform(scrollYProgress, [0, 1], [0, -56]);

  const desktopClasses = useMemo(() => projects.map((_, index) => desktopPattern[index % desktopPattern.length]), [projects]);
  const mobileClasses = useMemo(() => projects.map((_, index) => mobilePattern[index % mobilePattern.length]), [projects]);

  return (
    <main className='min-h-[220vh] bg-[#f4f4f4] text-[#111]'>
      <section className='sticky top-0 flex min-h-screen items-center overflow-hidden py-6'>
        <motion.div
          className='w-full origin-top'
          style={reducedMotion ? undefined : { scale: zoom, y: driftY }}
        >
          <div className='mx-auto w-[98vw]'>
            <div className='mb-5 flex items-end justify-between border-b border-black/15 px-2 pb-3'>
              <div>
                <p className='text-[10px] uppercase tracking-[0.24em] text-black/55'>Projects</p>
                <h1 className='mt-1 text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl'>Grid View Design</h1>
              </div>
              <p className='hidden text-xs uppercase tracking-[0.14em] text-black/55 sm:block'>Scroll to zoom in</p>
            </div>

            <div className='grid auto-rows-[22vw] grid-cols-4 gap-0 md:hidden'>
              {projects.map((project, index) => (
                <motion.article
                  key={`${project.slug}-mobile`}
                  className={`group relative overflow-hidden border border-black/10 ${mobileClasses[index]}`}
                  whileHover={reducedMotion ? undefined : { scale: 1.03, zIndex: 3 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                >
                  <Link href={`/projects/${project.slug}`} className='absolute inset-0 z-10' aria-label={`Open ${project.title}`} />
                  <motion.div
                    className='absolute inset-0'
                    animate={reducedMotion ? undefined : { scale: [1, 1.03, 1], x: [0, 3, 0], y: [0, -2, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: index * 0.25 }}
                  >
                    <Image src={project.image} alt={project.title} fill sizes='50vw' className='object-cover' />
                  </motion.div>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />
                </motion.article>
              ))}
            </div>

            <div className='hidden grid-cols-12 auto-rows-[6.4vw] gap-0 md:grid'>
              {projects.map((project, index) => (
                <motion.article
                  key={project.slug}
                  className={`group relative overflow-hidden border border-black/10 ${desktopClasses[index]}`}
                  whileHover={reducedMotion ? undefined : { scale: 1.02, zIndex: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link href={`/projects/${project.slug}`} className='absolute inset-0 z-20' aria-label={`Open ${project.title}`} />
                  <motion.div
                    className='absolute inset-0'
                    animate={reducedMotion ? undefined : { scale: [1, 1.025, 1], x: [0, 5, 0], y: [0, -4, 0] }}
                    transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 }}
                  >
                    <Image src={project.image} alt={project.title} fill sizes='(max-width: 1280px) 28vw, 18vw' className='object-cover' />
                  </motion.div>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/52 via-black/8 to-transparent opacity-80 transition duration-500 group-hover:opacity-95' />
                  <motion.div
                    className='absolute inset-x-0 bottom-0 z-10 p-3 text-white'
                    initial={false}
                    animate={reducedMotion ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                  >
                    <p className='text-[10px] uppercase tracking-[0.18em] text-white/72'>{project.category}</p>
                    <h2 className='mt-1 line-clamp-1 text-sm font-medium leading-tight lg:text-base'>{project.title}</h2>
                    <p className='mt-1 line-clamp-2 text-[11px] text-white/78'>{project.shortDescription}</p>
                  </motion.div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

