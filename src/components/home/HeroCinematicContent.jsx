"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import ShinyText from '@/components/animations/ShinyText';

function useMagneticMotion(disabled, config = {}) {
  const {
    translate = 8,
    rotate = 6,
    scale = 1.02,
    stiffness = 220,
    damping = 24
  } = config;

  const ref = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const zoom = useMotionValue(1);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowOpacity = useMotionValue(0);

  const springX = useSpring(x, { stiffness, damping });
  const springY = useSpring(y, { stiffness, damping });
  const springRotateX = useSpring(rotateX, { stiffness, damping });
  const springRotateY = useSpring(rotateY, { stiffness, damping });
  const springScale = useSpring(zoom, { stiffness: 220, damping: 18 });
  const springGlowOpacity = useSpring(glowOpacity, { stiffness: 220, damping: 22 });

  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.22), transparent 64%)`;

  const applyVector = (normX, normY, localX = 50, localY = 50) => {
    x.set(normX * translate);
    y.set(normY * translate);
    rotateY.set(normX * rotate);
    rotateX.set(-normY * rotate);
    zoom.set(scale);
    glowX.set(localX);
    glowY.set(localY);
    glowOpacity.set(1);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
    zoom.set(1);
    glowOpacity.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  const onPointerMove = (event) => {
    if (disabled || !ref.current) return;
    const rect = rectRef.current || ref.current.getBoundingClientRect();
    rectRef.current = rect;
    if (!rect.width || !rect.height) return;
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const normX = (localX / rect.width - 0.5) * 2;
    const normY = (localY / rect.height - 0.5) * 2;
    const glowPosX = (localX / rect.width) * 100;
    const glowPosY = (localY / rect.height) * 100;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      applyVector(normX, normY, glowPosX, glowPosY);
      rafRef.current = 0;
    });
  };

  const onPointerEnter = () => {
    if (disabled) return;
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
    applyVector(0, -0.55, 50, 50);
  };

  const onPointerDown = () => {
    if (disabled) return;
    zoom.set(scale * 0.97);
  };

  const onPointerUp = () => {
    if (disabled) return;
    zoom.set(scale);
  };

  const onPointerLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rectRef.current = null;
    reset();
  };

  return {
    ref,
    surfaceStyle: {
      x: springX,
      y: springY,
      rotateX: springRotateX,
      rotateY: springRotateY,
      scale: springScale,
      transformPerspective: 1200,
      transformStyle: 'preserve-3d'
    },
    glowStyle: {
      background: glow,
      opacity: springGlowOpacity
    },
    handlers: {
      onPointerMove,
      onPointerEnter,
      onPointerDown,
      onPointerUp,
      onPointerLeave
    }
  };
}

function MagneticLink({ href, className, children, disabled }) {
  const magnetic = useMagneticMotion(disabled, { translate: 14, rotate: 10, scale: 1.05 });
  return (
    <motion.a href={href} ref={magnetic.ref} {...magnetic.handlers} className={className}>
      <motion.span aria-hidden className='pointer-events-none absolute inset-0 rounded-[inherit]' style={magnetic.glowStyle} />
      <motion.span style={{ ...magnetic.surfaceStyle, willChange: 'transform' }} className='relative z-[1] block [transform-style:preserve-3d]'>
        <span className='block [transform:translateZ(18px)]'>{children}</span>
      </motion.span>
    </motion.a>
  );
}

function MagneticChip({ children, disabled }) {
  const magnetic = useMagneticMotion(disabled, { translate: 11, rotate: 8, scale: 1.045 });
  return (
    <motion.div
      ref={magnetic.ref}
      {...magnetic.handlers}
      className='relative flex h-full min-h-[78px] cursor-pointer items-center overflow-hidden border border-white/25 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-white/55 hover:bg-white/10 hover:[box-shadow:0_18px_42px_rgba(0,0,0,0.45)]'
    >
      <motion.span aria-hidden className='pointer-events-none absolute inset-0' style={magnetic.glowStyle} />
      <motion.span style={{ ...magnetic.surfaceStyle, willChange: 'transform' }} className='relative z-[1] block [transform-style:preserve-3d]'>
        <span className='block [transform:translateZ(20px)]'>{children}</span>
      </motion.span>
    </motion.div>
  );
}

export function HeroCinematicContent({ contact, chips, headline }) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reducedMotion = mounted ? prefersReducedMotion : false;

  const heroStatements = useMemo(
    () => [
      {
        heading: headline,
        body: 'From high-value residences and hospitality spaces in Jaipur, Rajasthan to premium workplace and lifestyle projects in Dubai, UAE, our team delivers luxury architecture and interior design with measurable execution clarity. Every stage is structured for decision speed: concept validation, buildable detailing, consultant coordination, and site-ready documentation.'
      },
      {
        heading: 'Design, Fit-Out, and Delivery\nEngineered for Speed,\nClarity, and Control.',
        body: 'We design spaces that reduce uncertainty at every phase. Our process aligns concept, approvals, detailing, and site coordination into one clear execution path so investors, founders, and homeowners can move faster with confidence.'
      },
      {
        heading: 'From Brief to Handover,\nEvery Decision Built\nfor Site Precision.',
        body: 'Wanderlust Architects combines design intelligence with delivery control. You get structured timelines, BOQ-ready documentation, and a single-point team that protects intent, speed, and quality across architecture, interiors, and fit-outs.'
      },
      {
        heading: 'Luxury Architecture and Interiors,\nStructured into Buildable\nExecution Systems.',
        body: 'Our studio balances aesthetic depth with technical rigor. From premium residences and hospitality to office environments, we build decision-ready design systems that perform on site, not just in presentations.'
      }
    ],
    [headline]
  );

  useEffect(() => {
    if (heroStatements.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroStatements.length);
    }, reducedMotion ? 7200 : 5600);

    return () => window.clearInterval(intervalId);
  }, [heroStatements.length, reducedMotion]);

  const headlineStart = 0.9;
  const ctaDelay = headlineStart + 0.84;
  const chipsDelay = ctaDelay + 0.14;
  const activeStatement = heroStatements[activeIndex] || heroStatements[0];

  return (
    <div className='relative w-full'>
      <motion.div
        className='relative z-10 w-full [transform-style:preserve-3d] [perspective:1600px]'
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className='min-h-[17.5rem] max-w-5xl'>
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={activeIndex}
              initial={reducedMotion ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reducedMotion ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: -14, filter: 'blur(5px)' }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.7, delay: activeIndex === 0 ? headlineStart : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                aria-label={activeStatement.heading}
                className='text-4xl leading-[1.02] text-white drop-shadow-[0_10px_34px_rgba(0,0,0,0.82)] sm:text-5xl lg:text-[5.2rem] [transform-style:preserve-3d]'
              >
                <ShinyText speedInMs={7000} className='inline-block whitespace-pre-line'>
                  {activeStatement.heading}
                </ShinyText>
              </h1>

              <p className='mt-5 max-w-4xl text-sm leading-relaxed text-zinc-200 sm:text-base [transform-style:preserve-3d] drop-shadow-[0_5px_16px_rgba(0,0,0,0.74)]'>
                {activeStatement.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className='mt-8 flex flex-wrap gap-3'
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { delay: ctaDelay, duration: 0.74, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticLink
            href={`tel:${contact.phone}`}
            disabled={false}
            className='relative inline-flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-md border border-white bg-white px-6 py-3 text-xs uppercase tracking-[0.22em] text-black transition-[background-color,color,letter-spacing,box-shadow,filter] duration-300 ease-out hover:bg-transparent hover:text-white hover:tracking-[0.26em] hover:[box-shadow:0_20px_42px_rgba(0,0,0,0.62)] hover:[filter:brightness(1.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
          >
            Book Consultation
          </MagneticLink>
          <MagneticLink
            href={contact.whatsapp}
            disabled={false}
            className='relative inline-flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-md border border-white/70 bg-transparent px-6 py-3 text-xs uppercase tracking-[0.22em] text-white transition-[border-color,background-color,color,letter-spacing,box-shadow,filter] duration-300 ease-out hover:border-white hover:bg-white hover:text-black hover:tracking-[0.26em] hover:[box-shadow:0_20px_42px_rgba(0,0,0,0.62)] hover:[filter:brightness(1.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
          >
            WhatsApp
          </MagneticLink>
        </motion.div>

        <motion.div
          className='mt-6 grid max-w-5xl gap-3 sm:grid-cols-3 sm:auto-rows-fr'
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reducedMotion ? { duration: 0 } : { delay: chipsDelay, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          {chips.map((chip, index) => (
            <motion.div
              key={chip}
              className='h-full'
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { delay: chipsDelay + index * 0.08, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            >
              <MagneticChip disabled={false}>{chip}</MagneticChip>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
