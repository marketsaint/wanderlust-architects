import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { GridZoomMosaic } from '@/components/projects-views/GridZoomMosaic';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Projects Grid View',
  description: 'All Wanderlust Architects projects displayed in a dense responsive grid with zoom-on-scroll motion.',
  alternates: {
    canonical: `${siteUrl}/projects/grid-view`
  }
};

export default function ProjectsGridViewPage() {
  const projects = getProjects().map((project) => ({
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription || project.excerpt,
    image: project.images?.[0],
    category: project.category,
    location: project.location
  }));

  return (
    <>
      <div className='fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border border-black/15 bg-white/85 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-black/70 shadow-[0_8px_20px_rgba(0,0,0,0.1)] backdrop-blur'>
        <Link href='/projects/images-with-content' className='transition hover:text-black'>Switch to Images + Content View</Link>
      </div>
      <GridZoomMosaic projects={projects} />
    </>
  );
}

