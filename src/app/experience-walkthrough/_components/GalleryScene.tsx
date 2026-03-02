'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export type WalkProject = {
  slug: string;
  title: string;
  location: string;
  category: string;
  excerpt: string;
  image: string;
};

type GallerySceneProps = {
  projects: WalkProject[];
  reducedMotion: boolean;
  mode: 'calm' | 'active';
};

type TiltThumbProps = {
  project: WalkProject;
  reducedMotion: boolean;
};

function TiltThumb({ project, reducedMotion }: TiltThumbProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className='group relative overflow-hidden rounded-lg border border-white/20 bg-black/35 [transform-style:preserve-3d] transition-shadow hover:shadow-[0_16px_34px_rgba(0,0,0,0.36)]'
      onPointerMove={(event) => {
        if (reducedMotion) return;
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        const py = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
        target.style.transform = `perspective(900px) rotateX(${py}deg) rotateY(${px}deg)`;
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      }}
    >
      <div className='relative h-28 sm:h-32'>
        <Image src={project.image} alt={project.title} fill sizes='(max-width: 1024px) 50vw, 20vw' className='object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]' />
      </div>
      <div className='space-y-1 p-3'>
        <p className='text-[10px] uppercase tracking-[0.18em] text-zinc-400'>{project.category}</p>
        <p className='text-sm leading-tight text-zinc-200'>{project.title}</p>
      </div>
    </Link>
  );
}

export function GalleryScene({ projects, reducedMotion, mode }: GallerySceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex] || projects[0];
  const cinematic = !reducedMotion && mode === 'active';

  return (
    <section className='h-full bg-[#090909] p-5 sm:p-8 lg:p-10'>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-xs uppercase tracking-[0.24em] text-zinc-400'>Scene 03 · Living Gallery</p>
        <p className='text-xs uppercase tracking-[0.2em] text-zinc-500'>Spine + Grid</p>
      </div>

      <div className='grid h-[calc(100%-2.5rem)] gap-4 lg:grid-cols-[220px_1fr_300px]'>
        <aside className='rounded-lg border border-white/15 bg-black/40 p-3'>
          <div className='relative h-full'>
            <div className='absolute bottom-4 left-3 top-4 w-px bg-white/15' />
            <div className='space-y-2'>
              {projects.slice(0, 6).map((project, idx) => (
                <button
                  key={project.slug}
                  type='button'
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-full rounded-md px-3 py-2 text-left transition-colors ${
                    idx === activeIndex ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  <span className='absolute -left-[14px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/60 bg-black' />
                  <p className='text-[10px] uppercase tracking-[0.18em]'>{String(idx + 1).padStart(2, '0')}</p>
                  <p className='mt-1 text-sm leading-tight'>{project.title}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <motion.article
          key={active.slug}
          initial={cinematic ? { opacity: 0, y: 18 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: cinematic ? 0.35 : 0 }}
          className='relative overflow-hidden rounded-lg border border-white/20 bg-black'
        >
          <div className='relative h-full min-h-[360px]'>
            <Image src={active.image} alt={active.title} fill sizes='(max-width: 1024px) 100vw, 55vw' className='object-cover grayscale' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent' />
            <div className='absolute inset-x-0 bottom-0 p-6'>
              <p className='text-xs uppercase tracking-[0.2em] text-zinc-300'>{active.category} · {active.location}</p>
              <h3 className='mt-2 text-3xl leading-tight'>{active.title}</h3>
              <p className='mt-2 max-w-2xl text-sm text-zinc-300'>{active.excerpt}</p>
              <Link href={`/projects/${active.slug}`} className='mt-4 inline-flex rounded-md border border-white/70 px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black'>
                Open Case
              </Link>
            </div>
          </div>
        </motion.article>

        <div className='grid gap-3 overflow-y-auto rounded-lg border border-white/15 bg-black/30 p-3'>
          {projects.slice(0, 9).map((project) => (
            <TiltThumb key={`${project.slug}-thumb`} project={project} reducedMotion={reducedMotion || mode === 'calm'} />
          ))}
        </div>
      </div>
    </section>
  );
}

