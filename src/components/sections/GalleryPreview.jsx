"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Tabs } from '@/components/ui/Tabs';

export function GalleryPreview({ projects }) {
  const categories = ['All', ...new Set(projects.map((project) => project.category))];
  const [active, setActive] = useState('All');

  const visible = useMemo(() => {
    if (active === 'All') return projects.slice(0, 6);
    return projects.filter((project) => project.category === active).slice(0, 6);
  }, [active, projects]);

  return (
    <div className='space-y-6'>
      <Tabs items={categories} active={active} onChange={setActive} />
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {visible.map((project) => (
          <article key={project.slug} className='group overflow-hidden border border-mist bg-white'>
            <div className='relative h-52'>
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                sizes='(max-width: 768px) 100vw, 33vw'
                className='object-cover transition duration-700 group-hover:scale-105'
              />
            </div>
            <div className='p-4'>
              <p className='text-xs uppercase tracking-[0.2em] text-iron'>{project.category}</p>
              <h3 className='mt-2 text-lg'>{project.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
