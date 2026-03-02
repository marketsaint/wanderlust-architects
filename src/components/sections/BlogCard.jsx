"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { estimateReadTime, formatDate } from '@/lib/format';
import { applyPointerGlow, resetPointerGlow } from '@/lib/pointerGlow';

export function BlogCard({ blog, basePath = '/blog' }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      <Card onMouseMove={applyPointerGlow} onMouseLeave={resetPointerGlow} className='architect-card group h-full overflow-hidden rounded-xl transition-all duration-300 hover:border-ink hover:shadow-soft'>
        <div className='relative h-52'>
          <Image src={blog.coverImage} alt={blog.title} fill sizes='(max-width: 768px) 100vw, 50vw' className='object-cover grayscale transition duration-700 group-hover:grayscale-0' />
        </div>
        <div className='p-6'>
          <div className='mb-4 flex flex-wrap gap-2'>
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h3 className='mb-3 text-2xl leading-tight'>
            <Link href={`${basePath}/${blog.slug}`} className='hover:text-iron'>
              {blog.title}
            </Link>
          </h3>
          <p className='text-xs uppercase tracking-[0.16em] text-iron'>
            {formatDate(blog.date)} | {estimateReadTime(blog.content)}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

