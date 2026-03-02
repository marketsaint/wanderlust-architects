'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Chapter = {
  key: string;
  chapter: string;
  title: string;
  body: string;
  image: string;
};

type ExperienceNarrativeProps = {
  chapters: Chapter[];
  toneClass: string;
};

export function ExperienceNarrative({ chapters, toneClass }: ExperienceNarrativeProps) {
  const reducedMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(chapters[0]?.key || '');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveChapter((visible.target as HTMLElement).dataset.chapter || activeChapter);
      },
      { threshold: [0.35, 0.6], rootMargin: '-15% 0px -25% 0px' }
    );

    chapters.forEach((chapter) => {
      const node = sectionRefs.current[chapter.key];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [chapters, activeChapter]);

  const active = useMemo(() => chapters.find((chapter) => chapter.key === activeChapter) || chapters[0], [activeChapter, chapters]);

  return (
    <section id='chapter-context' className={`border-y border-mist ${toneClass}`}>
      <div className='mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-2'>
        <div className='relative hidden border-r border-mist lg:block'>
          <div className='sticky top-20 h-[calc(100svh-5rem)] overflow-hidden'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={active.key}
                initial={reducedMotion ? false : { opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.995 }}
                transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                className='relative h-full w-full'
              >
                <Image src={active.image} alt={`${active.chapter} narrative visual`} fill sizes='50vw' className='object-cover grayscale' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent' />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div>
          {chapters.map((chapter) => (
            <article
              key={chapter.key}
              data-chapter={chapter.key}
              ref={(el) => {
                sectionRefs.current[chapter.key] = el;
              }}
              className='min-h-[85svh] border-b border-mist px-6 py-16 sm:px-10 lg:px-14 lg:py-24'
            >
              <div className='mx-auto flex h-full max-w-xl flex-col justify-center space-y-6'>
                <p className='text-[11px] uppercase tracking-[0.24em] text-iron'>{chapter.chapter}</p>
                <h2 className='text-4xl leading-[1.05] sm:text-5xl'>{chapter.title}</h2>
                <p className='text-sm leading-relaxed text-iron sm:text-base'>{chapter.body}</p>

                <div className='relative mt-3 h-64 overflow-hidden border border-mist lg:hidden'>
                  <Image src={chapter.image} alt={chapter.title} fill sizes='100vw' className='object-cover grayscale' />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

