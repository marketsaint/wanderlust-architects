import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { ExperienceShell } from './ExperienceShell';
import { rooms } from './_data/rooms';
import { getRegionFromHeaders } from '@/lib/region';
import { getContactByRegion } from '@/lib/contact';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Architectural Walkthrough',
  description:
    'An immersive architectural walkthrough from blueprint logic to rendered spatial clarity by Wanderlust Architects.',
  alternates: {
    canonical: `${siteUrl}/experience`
  },
  openGraph: {
    title: 'Wanderlust Architects | Architectural Walkthrough',
    description:
      'Explore a cinematic architecture walkthrough blending planning intelligence with execution-ready detailing.',
    url: `${siteUrl}/experience`
  }
};

export default async function ExperiencePage() {
  const requestHeaders = await headers();
  const region = getRegionFromHeaders(requestHeaders as unknown as Headers);
  const contact = getContactByRegion(region);

  return <ExperienceShell rooms={rooms} contact={contact} />;
}
