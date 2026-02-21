"use client";

import { motion } from 'framer-motion';

export function StatsStrip() {
  const stats = [
    { label: 'Project Completed', value: 280 },
    { label: 'Design Drawing', value: 1450 },
    { label: 'Design Award', value: 26 },
    { label: 'Project Running', value: 42 }
  ];

  return (
    <div className='grid gap-6 border border-mist bg-white p-8 shadow-soft sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          whileHover={{ scale: 1.02 }}
          className='border-b border-mist pb-5 transition-transform duration-300 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6 last:border-none'
        >
          <p className='text-4xl'>{stat.value}+</p>
          <p className='mt-1 text-xs uppercase tracking-[0.2em] text-iron'>{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
