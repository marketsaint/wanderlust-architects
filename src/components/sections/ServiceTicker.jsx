"use client";

import { motion } from 'framer-motion';

const items = [
  'Architecture Design',
  'Interior Design',
  'Office Fit-Outs',
  'Project Delivery',
  'Building Documentation',
  'Landscape Design'
];

export function ServiceTicker() {
  const track = [...items, ...items];

  return (
    <section className='overflow-hidden border-b border-t border-mist bg-white py-4'>
      <motion.div
        className='flex min-w-max gap-10 px-6'
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {track.map((item, index) => (
          <p key={`${item}-${index}`} className='text-xs uppercase tracking-[0.24em] text-iron'>
            {item}
          </p>
        ))}
      </motion.div>
    </section>
  );
}
