"use client";

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Tabs } from '@/components/ui/Tabs';

const filters = ['All', 'Building Documentation', 'Interior', 'Architecture', 'Landscape'];

export function ProjectGalleryTabs({ projects, fallbackImages }) {
  const [active, setActive] = useState('All');

  const items = useMemo(() => {
    const scoped = active === 'All' ? projects : projects.filter((item) => item.category === active);
    const cards = scoped.slice(0, 6).map((item, index) => ({
      id: item.slug,
      title: item.title,
      category: item.category,
      image: item.images[0] || fallbackImages[index % fallbackImages.length]
    }));

    if (cards.length < 6) {
      const missing = 6 - cards.length;
      for (let i = 0; i < missing; i += 1) {
        cards.push({
          id: `fallback-${active}-${i}`,
          title: `${active} Visual ${i + 1}`,
          category: active,
          image: fallbackImages[i % fallbackImages.length]
        });
      }
    }

    return cards;
  }, [active, fallbackImages, projects]);

  return (
    <section className='space-y-6'>
      <Tabs items={filters} active={active} onChange={setActive} />
      <motion.div layout className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map((item) => (
          <motion.article
            layout
            key={item.id}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            className='group overflow-hidden border border-mist bg-white'
          >
            <div className='relative h-56'>
              <Image src={item.image} alt={item.title} fill sizes='(max-width: 768px) 100vw, 33vw' className='object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0' />
            </div>
            <div className='p-4'>
              <p className='text-[10px] uppercase tracking-[0.18em] text-iron'>{item.category}</p>
              <h3 className='mt-2 text-lg'>{item.title}</h3>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
