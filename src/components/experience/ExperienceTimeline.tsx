'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type TimelineStep = {
  title: string;
  line: string;
};

type ExperienceTimelineProps = {
  steps: TimelineStep[];
};

export function ExperienceTimeline({ steps }: ExperienceTimelineProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  const desktopShift = useTransform(scrollYProgress, [0, 1], ['0%', '-46%']);

  return (
    <section ref={sectionRef} className='border-b border-mist bg-white lg:min-h-[180svh]'>
      <div className='mx-auto max-w-[1600px] px-6 py-14 sm:px-10 lg:px-16 lg:py-20'>
        <p className='text-[11px] uppercase tracking-[0.24em] text-iron'>Process Timeline</p>
        <h2 className='mt-4 text-4xl leading-tight sm:text-5xl'>Architectural grid from intent to handover.</h2>
      </div>

      <div className='mx-auto max-w-[1600px] px-6 pb-16 sm:px-10 lg:hidden'>
        <div className='grid gap-4'>
          {steps.map((step, index) => (
            <article key={step.title} className='border border-mist p-5'>
              <p className='text-3xl leading-none text-ink/80'>0{index + 1}</p>
              <h3 className='mt-3 text-2xl'>{step.title}</h3>
              <p className='mt-2 text-sm text-iron'>{step.line}</p>
            </article>
          ))}
        </div>
      </div>

      <div className='relative hidden lg:block'>
        <div className='sticky top-20 h-[calc(100svh-5rem)] overflow-hidden border-t border-mist'>
          <motion.div
            style={reducedMotion ? undefined : { x: desktopShift }}
            className='flex h-full w-[185vw] items-center gap-8 px-16'
          >
            {steps.map((step, index) => (
              <article key={step.title} className='relative w-[26vw] min-w-[320px] border border-mist bg-white p-8'>
                <div className='absolute left-0 right-0 top-0 h-px bg-mist' />
                <p className='text-5xl leading-none text-ink/80'>0{index + 1}</p>
                <h3 className='mt-6 text-4xl leading-tight'>{step.title}</h3>
                <p className='mt-4 text-sm text-iron'>{step.line}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

