import type { Metadata } from 'next';
import { getHeroImage, getProjects } from '@/lib/content';
import { IPhoneMenuShell } from './IPhoneMenuShell';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'iPhone Menu Showcase',
  description: 'iPhone-style project application menu showcase by Wanderlust Architects.',
  alternates: {
    canonical: `${siteUrl}/experience/watch-copy`
  }
};

export default function WatchCopyPage() {
  const fallbackImage = getHeroImage();
  const projects = getProjects().map((project) => ({
    slug: project.slug,
    title: project.title,
    image: project.images?.[0] || fallbackImage
  }));

  return <IPhoneMenuShell projects={projects} />;
}
