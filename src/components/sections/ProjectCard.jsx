"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { applyPointerGlow, resetPointerGlow } from '@/lib/pointerGlow';

export function ProjectCard({ project, priority = false }) {
  const outcome = project.outcome || 'Delivered with precision & clarity.';

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      <Card onMouseMove={applyPointerGlow} onMouseLeave={resetPointerGlow} className='architect-card group overflow-hidden transition-all duration-300 hover:border-ink hover:shadow-soft'>
        <Link href={`/projects/${project.slug}`} className='block'>
          <div className='relative h-64 overflow-hidden bg-ink/5'>
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              priority={priority}
              className='object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0'
            />
            <div className='absolute inset-x-0 bottom-0 translate-y-8 bg-gradient-to-t from-black/70 to-transparent p-5 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
              <p className='text-xs uppercase tracking-[0.2em]'>{project.location}</p>
            </div>
          </div>
          <div className='space-y-4 p-6'>
            <div className='flex items-center justify-between gap-3'>
              <Badge>{project.category}</Badge>
              <span className='text-xs uppercase tracking-[0.2em] text-iron'>{project.year}</span>
            </div>
            <h3 className='text-xl leading-tight'>{project.title}</h3>
            <p className='text-sm text-iron'>{project.location}</p>
            <p className='text-xs uppercase tracking-[0.18em] text-iron'>{outcome}</p>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}
