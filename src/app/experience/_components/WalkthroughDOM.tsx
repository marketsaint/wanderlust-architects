'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { RoomConfig } from '../_data/rooms';

type ContactInfo = {
  phone: string;
  whatsapp: string;
  email: string;
};

type WalkthroughDOMProps = {
  rooms: RoomConfig[];
  contact: ContactInfo;
};

export function WalkthroughDOM({ rooms, contact }: WalkthroughDOMProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className='relative z-10'>
      <section className='relative flex min-h-screen items-end border-b border-white/10 px-6 pb-16 pt-36 sm:px-10 lg:px-16'>
        <div className='mx-auto w-full max-w-6xl'>
          <p className='text-xs uppercase tracking-[0.32em] text-zinc-400'>Wanderlust Architects</p>
          <h1 className='mt-4 max-w-4xl font-serif text-4xl leading-[1.05] text-white sm:text-5xl lg:text-7xl'>
            Architectural Walkthrough
          </h1>
          <p className='mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg'>
            A single continuous journey through concept, spatial logic, and execution readiness. Scroll to move from blueprint intent into rendered clarity.
          </p>
          <p className='mt-8 text-xs uppercase tracking-[0.24em] text-zinc-500'>Scroll to begin</p>
        </div>
      </section>

      {rooms.map((room, index) => (
        <section
          key={room.id}
          id={`room-${room.id}`}
          data-room-section='true'
          className='relative flex min-h-screen items-center border-b border-white/10 px-6 py-20 sm:px-10 lg:px-16'
        >
          <motion.div
            className='mx-auto w-full max-w-6xl'
            initial={false}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.45 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }}
            style={reducedMotion ? undefined : { opacity: 0.98 }}
          >
            <p className='text-xs uppercase tracking-[0.28em] text-zinc-400'>Chapter {String(index + 1).padStart(2, '0')}</p>
            <h2 className='mt-4 max-w-3xl font-serif text-3xl text-white sm:text-5xl'>{room.title}</h2>
            <p className='mt-4 max-w-3xl text-lg text-zinc-300'>{room.subtitle}</p>
            <ul className='mt-8 grid max-w-4xl gap-3 text-sm text-zinc-300 sm:grid-cols-2'>
              {room.bullets.map((bullet) => (
                <li key={bullet} className='rounded-lg border border-white/12 bg-black/35 px-4 py-3'>
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      ))}

      <section className='relative flex min-h-screen items-center px-6 py-24 sm:px-10 lg:px-16'>
        <div className='mx-auto w-full max-w-5xl rounded-2xl border border-white/15 bg-black/55 p-8 sm:p-12'>
          <p className='text-xs uppercase tracking-[0.3em] text-zinc-400'>Final Scene</p>
          <h2 className='mt-5 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-6xl'>
            Let&apos;s build a space that performs as beautifully as it looks.
          </h2>
          <div className='mt-10 flex flex-wrap gap-3'>
            <a
              href={`tel:${contact.phone}`}
              className='inline-flex items-center rounded-full border border-white px-6 py-3 text-xs uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-black'
            >
              Call Studio
            </a>
            <a
              href={contact.whatsapp}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.22em] text-zinc-200 transition hover:border-white hover:text-white'
            >
              WhatsApp
            </a>
            <Link
              href='/projects'
              className='inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.22em] text-zinc-200 transition hover:border-white hover:text-white'
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
