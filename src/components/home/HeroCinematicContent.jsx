"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

function useMagneticMotion(disabled, config = {}) {
  const {
    translate = 8,
    rotate = 6,
    scale = 1.02,
    stiffness = 170,
    damping = 20
  } = config;

  const ref = useRef(null);

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
    const rect = ref.current.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const normX = (localX / rect.width - 0.5) * 2;
    const normY = (localY / rect.height - 0.5) * 2;

    x.set(normX * translate);
    y.set(normY * translate);
    rotateY.set(normX * rotate);
    rotateX.set(-normY * rotate);
    zoom.set(scale);

    glowX.set((localX / rect.width) * 100);
    glowY.set((localY / rect.height) * 100);
    glowOpacity.set(1);
  };

  const onPointerEnter = () => {
    if (disabled) return;
    y.set(-translate * 0.9);
    x.set(0);
    rotateX.set(rotate * 0.75);
    rotateY.set(0);
    zoom.set(scale);
    glowOpacity.set(1);
    glowX.set(50);
    glowY.set(50);
  };

  const onPointerLeave = () => {
    reset();
  };

  return {
    ref,
    style: {
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
      onPointerLeave
    }
  };
}

function MagneticLink({ href, className, children, disabled }) {
  const magnetic = useMagneticMotion(disabled, { translate: 22, rotate: 14, scale: 1.075 });
  return (
    <motion.a href={href} ref={magnetic.ref} style={magnetic.style} {...magnetic.handlers} className={className}>
      <motion.span aria-hidden className='pointer-events-none absolute inset-0 rounded-[inherit]' style={magnetic.glowStyle} />
      <span className='relative z-[1] block [transform:translateZ(18px)]'>{children}</span>
    </motion.a>
  );
}

function MagneticChip({ children, disabled }) {
  const magnetic = useMagneticMotion(disabled, { translate: 16, rotate: 11, scale: 1.06 });
  return (
    <motion.div
      ref={magnetic.ref}
      style={magnetic.style}
      {...magnetic.handlers}
      className='relative flex h-full min-h-[78px] items-center overflow-hidden border border-white/25 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-white/55 hover:bg-white/10 hover:[box-shadow:0_18px_42px_rgba(0,0,0,0.45)]'
    >
      <motion.span aria-hidden className='pointer-events-none absolute inset-0' style={magnetic.glowStyle} />
      <span className='relative z-[1] block [transform:translateZ(20px)]'>{children}</span>
    </motion.div>
  );
}

export function HeroCinematicContent({ contact, chips, headline }) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reducedMotion = mounted ? prefersReducedMotion : false;
  const words = useMemo(() => headline.split(' '), [headline]);

  const headlineStart = 0.9;
  const wordStep = reducedMotion ? 0 : 0.062;
  const paragraphDelay = headlineStart + words.length * wordStep + 0.14;
  const ctaDelay = paragraphDelay + 0.18;
  const chipsDelay = ctaDelay + 0.14;

  return (
    <div className='relative w-full'>
      <motion.div
        className='relative z-10 w-full [transform-style:preserve-3d] [perspective:1600px]'
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className='text-xs uppercase tracking-[0.25em] text-zinc-200 drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)]'
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.72, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          Wanderlust Architects
        </motion.p>

        <h1 aria-label={headline} className='mt-4 max-w-5xl text-4xl leading-[1.02] text-white drop-shadow-[0_10px_34px_rgba(0,0,0,0.82)] sm:text-5xl lg:text-[5.2rem] [transform-style:preserve-3d]'>
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              aria-hidden='true'
              className='mr-[0.18em] inline-block'
              style={{ textShadow: '0 14px 30px rgba(0,0,0,0.52)' }}
              initial={
                reducedMotion
                  ? { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }
                  : { opacity: 0, y: 34, rotateX: 72, scale: 0.97, filter: 'blur(4px)' }
              }
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      delay: headlineStart + index * wordStep,
                      type: 'spring',
                      stiffness: 180,
                      damping: 20,
                      mass: 0.72
                    }
              }
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className='mt-5 max-w-4xl text-sm leading-relaxed text-zinc-200 sm:text-base [transform-style:preserve-3d] drop-shadow-[0_5px_16px_rgba(0,0,0,0.74)]'
          initial={
            reducedMotion
              ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 20, rotateX: 8, filter: 'blur(6px)' }
          }
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          transition={reducedMotion ? { duration: 0 } : { delay: paragraphDelay, duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
        >
          From high-value residences and hospitality spaces in Jaipur, Rajasthan to premium workplace and lifestyle projects in Dubai, UAE, our team delivers luxury architecture and interior design with measurable execution clarity. Every stage is structured for decision speed: concept validation, buildable detailing, consultant coordination, and site-ready documentation. The result is a process that reduces ambiguity, protects timelines, and keeps your project moving from brief to handover with confidence.
        </motion.p>

        <motion.div
          className='mt-8 flex flex-wrap gap-3'
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { delay: ctaDelay, duration: 0.74, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticLink
            href={`tel:${contact.phone}`}
            disabled={false}
            className='relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md border border-white bg-white px-6 py-3 text-xs uppercase tracking-[0.22em] text-black transition-[background-color,color,letter-spacing,box-shadow,filter] duration-300 ease-out hover:bg-transparent hover:text-white hover:tracking-[0.26em] hover:[box-shadow:0_20px_42px_rgba(0,0,0,0.62)] hover:[filter:brightness(1.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
          >
            Book Consultation
          </MagneticLink>
          <MagneticLink
            href={contact.whatsapp}
            disabled={false}
            className='relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md border border-white/70 bg-transparent px-6 py-3 text-xs uppercase tracking-[0.22em] text-white transition-[border-color,background-color,color,letter-spacing,box-shadow,filter] duration-300 ease-out hover:border-white hover:bg-white hover:text-black hover:tracking-[0.26em] hover:[box-shadow:0_20px_42px_rgba(0,0,0,0.62)] hover:[filter:brightness(1.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
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
