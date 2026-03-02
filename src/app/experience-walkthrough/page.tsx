import type { Metadata } from 'next';
import HomePage from '@/app/page';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Experience Walkthrough',
  description: 'Experience walkthrough route using the same content structure as the home page.',
  alternates: {
    canonical: `${siteUrl}/experience-walkthrough`
  },
  openGraph: {
    title: 'Wanderlust Architects | Experience Walkthrough',
    description: 'Home-page-equivalent content for the experience walkthrough route.',
    url: `${siteUrl}/experience-walkthrough`
  }
};

export default async function ExperienceWalkthroughPage() {
  return <HomePage />;
}
