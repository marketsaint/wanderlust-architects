import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { StructuredData } from '@/components/seo/StructuredData';
import {
  HomeAboutSection,
  HomeBrandsSection,
  HomeGallerySection,
  HomeHeroSection,
  HomeJournalSection,
  HomeProcessSection,
  HomeProjectsSection,
  HomeProofBarSection,
  HomeServicesSection,
  HomeStatsSection,
  HomeTestimonialsSection
} from '@/components/home/HomeSections';
import { getHomePayload } from '@/lib/homeData';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home',
    description:
      'Wanderlust Architects delivers luxury architecture and interior design services across Jaipur, Rajasthan and Dubai, UAE with execution-ready detailing and single-point project delivery.',
    alternates: {
      canonical: `${siteUrl}/`
    },
    openGraph: {
      title: 'Wanderlust Architects',
      description:
        'Luxury architecture and interior design studio serving Jaipur, Rajasthan and Dubai, UAE with design-to-delivery precision.',
      url: `${siteUrl}/`
    }
  };
}

export default async function HomePage() {
  const payload = await getHomePayload();

  return (
    <>
      <StructuredData baseUrl={siteUrl} />

      <HomeHeroSection heroImage={payload.heroImage} contact={payload.contact} />
      <HomeProofBarSection proofBarCopy={payload.proofBarCopy} />
      <HomeProcessSection />

      <Container className='space-y-24 py-20 lg:py-24'>
        <HomeServicesSection serviceImages={payload.serviceImages} />
        <HomeProjectsSection featuredProjects={payload.featuredProjects} />
        <HomeAboutSection aboutImage={payload.aboutImage} />
        <HomeBrandsSection logoImages={payload.logoImages} />
        <HomeGallerySection projects={payload.projects} galleryFallbacks={payload.galleryFallbacks} />
        <HomeStatsSection />
        <HomeTestimonialsSection />
        <HomeJournalSection latestBlogs={payload.latestBlogs} />
      </Container>
    </>
  );
}
