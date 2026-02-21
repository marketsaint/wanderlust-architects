"use client";

import { useState } from 'react';
import Link from 'next/link';
import { extractToc, markdownToBlocks } from '@/lib/markdown';
import { Button } from '@/components/ui/Button';

export function BlogArticle({ blog, basePath = '/journal' }) {
  const [openToc, setOpenToc] = useState(true);
  const toc = extractToc(blog.content);
  const blocks = markdownToBlocks(blog.content);
  const shareUrl = `https://wanderlustarchitects.com${basePath}/${blog.slug}`;

  return (
    <div className='grid gap-12 lg:grid-cols-[1fr_320px]'>
      <article className='prose max-w-none rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
        {blocks.map((block, index) => {
          if (block.type === 'h2') {
            return (
              <h2 key={index} id={block.id} className='mt-10 text-4xl'>
                {block.content}
              </h2>
            );
          }

          if (block.type === 'h3') {
            return (
              <h3 key={index} id={block.id} className='mt-8 text-2xl'>
                {block.content}
              </h3>
            );
          }

          if (block.type === 'ul') {
            return (
              <ul key={index} className='space-y-2 pl-5'>
                {block.items.map((item) => (
                  <li key={item} className='list-disc text-iron'>
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={index} className='text-base leading-relaxed text-iron'>
              {block.content}
            </p>
          );
        })}
        <div className='mt-12 border-t border-mist pt-8'>
          <p className='text-xs uppercase tracking-[0.2em] text-iron'>Share</p>
          <div className='mt-3 flex gap-2'>
            <Button variant='subtle' href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target='_blank' rel='noreferrer'>
              LinkedIn
            </Button>
            <Button variant='subtle' href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target='_blank' rel='noreferrer'>
              X
            </Button>
          </div>
        </div>
      </article>
      <aside className='h-fit rounded-xl border border-mist bg-white p-6 shadow-soft lg:sticky lg:top-24'>
        <button
          type='button'
          onClick={() => setOpenToc((v) => !v)}
          className='flex w-full items-center justify-between text-left text-xs uppercase tracking-[0.2em]'
          aria-expanded={openToc}
        >
          Table of Contents
          <span>{openToc ? '-' : '+'}</span>
        </button>
        {openToc ? (
          <ul className='mt-4 space-y-3'>
            {toc.map((item) => (
              <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                <Link href={`#${item.id}`} className='text-sm text-iron hover:text-ink'>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </aside>
    </div>
  );
}
