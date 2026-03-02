import type { Metadata } from 'next';
import { getHeroImage, getProjects } from '@/lib/content';
import { WatchShell } from './WatchShell';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Watch Experience',
  description: 'Apple Watch inspired project honeycomb experience by Wanderlust Architects.',
  alternates: {
    canonical: `${siteUrl}/experience/watch`
  }
};

export default function WatchPage() {
  const fallbackImage = getHeroImage();
  const projects = getProjects().map((project) => ({
    slug: project.slug,
    title: project.title,
    image: project.images?.[0] || fallbackImage
  }));

  return <WatchShell projects={projects} />;
}
