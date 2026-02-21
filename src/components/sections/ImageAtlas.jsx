"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';

export function ImageAtlas() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 30;

  useEffect(() => {
    if (!loaded || items.length) return;
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/wanderlust_images.json');
        const json = await response.json();
        if (!ignore) setItems(Array.isArray(json) ? json : []);
      } catch {
        if (!ignore) setItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [items.length, loaded]);

  const filters = useMemo(() => ['All', ...new Set(items.map((item) => item.pageType))], [items]);

  const filtered = useMemo(() => {
    if (filter === 'All') return items;
    return items.filter((item) => item.pageType === filter);
  }, [filter, items]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const visible = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, totalPages]);

  const onFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  if (!loaded) {
    return (
      <div className='border border-mist bg-white p-8'>
        <p className='text-sm text-iron'>Load all crawled images only when needed to keep initial page load fast.</p>
        <div className='mt-4'>
          <Button onClick={() => setLoaded(true)}>Load Image Library</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className='border border-mist bg-white p-8 text-sm text-iron'>Loading crawled image library...</div>;
  }

  return (
    <div className='space-y-6'>
      <Tabs items={filters} active={filter} onChange={onFilterChange} />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {visible.map((item) => (
          <article key={`${item.pageUrl}-${item.imageUrl}`} className='overflow-hidden border border-mist bg-white'>
            <div className='relative h-52'>
              <Image src={item.imageUrl} alt={item.altOrTitle || item.contentHint} fill sizes='(max-width: 768px) 100vw, 33vw' className='object-cover' />
            </div>
            <div className='space-y-2 p-4'>
              <p className='text-[10px] uppercase tracking-[0.18em] text-iron'>
                {item.pageType} | {item.serviceOrCategory}
              </p>
              <p className='line-clamp-2 text-sm'>{item.contentHint}</p>
            </div>
          </article>
        ))}
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3 border-t border-mist pt-5'>
        <p className='text-xs uppercase tracking-[0.16em] text-iron'>
          Showing {visible.length} of {filtered.length} images
        </p>
        <div className='flex gap-2'>
          <Button variant='subtle' onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </Button>
          <Button variant='subtle' onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
