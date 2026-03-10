import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { HorizontalProjectsWithContent } from '@/components/projects-views/HorizontalProjectsWithContent';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Projects Images With Content',
  description: 'Editorial projects rail with horizontal motion controlled by vertical scroll.',
  alternates: {
    canonical: `${siteUrl}/projects/images-with-content`
  }
};

export default function ProjectsImagesWithContentPage() {
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
        <Link href='/projects/grid-view' className='transition hover:text-black'>Switch to Grid View Design</Link>
      </div>
      <HorizontalProjectsWithContent projects={projects} />
    </>
  );
}

