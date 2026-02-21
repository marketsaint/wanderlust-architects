"use client";

import { useMemo, useState } from 'react';
import { BlogCard } from '@/components/sections/BlogCard';
import { Button } from '@/components/ui/Button';

export function BlogListClient({ blogs, basePath = '/journal' }) {
  const perPage = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(blogs.length / perPage);

  const visible = useMemo(() => {
    const start = (page - 1) * perPage;
    return blogs.slice(start, start + perPage);
  }, [blogs, page]);

  return (
    <div className='space-y-8'>
      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {visible.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} basePath={basePath} />
        ))}
      </div>
      <div className='flex flex-wrap items-center justify-between gap-4 border-t border-mist pt-6'>
        <p className='text-xs uppercase tracking-[0.18em] text-iron'>Page {page} of {totalPages}</p>
        <div className='flex gap-3'>
          <Button variant='subtle' onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </Button>
          <Button variant='subtle' onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
