import type { Metadata } from 'next';
import {
  getAboutImage,
  getBlogThumbs,
  getFeaturedProjectImages,
  getGalleryFallbacks,
  getHeroImage,
  getImagesForHint,
  getTeamImages
} from '@/lib/imageMap';
import { WatchDomeShell } from './WatchDomeShell';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Watch Dome Experience',
  description: 'Apple Watch inspired dome gallery interaction for Wanderlust Architects.',
  alternates: {
    canonical: `${siteUrl}/experience/watch-dome`
  }
};

const labels = [
  'Arrival Study',
  'Residential Frame',
  'Hospitality Axis',
  'Material Language',
  'Spatial Rhythm',
  'Lighting Story',
  'Landscape Layer',
  'Project Signature'
];

export default function WatchDomePage() {
  const imagePool = Array.from(
    new Set([
      getHeroImage(),
      getAboutImage(),
      ...getFeaturedProjectImages(),
      ...getGalleryFallbacks(),
      ...getBlogThumbs(),
      ...getTeamImages(),
      ...getImagesForHint(['architecture', 'interior', 'hotel', 'villa'], 20)
    ].filter(Boolean))
  );

  const items = imagePool.slice(0, 36).map((image, index) => ({
    id: `watch-dome-${index}`,
    image,
    title: labels[index % labels.length],
    subtitle: `Frame ${String(index + 1).padStart(2, '0')}`
  }));

  return <WatchDomeShell items={items} />;
}
