import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { BlogCard } from '@/components/sections/BlogCard';
import { StatsStrip } from '@/components/sections/StatsStrip';
import { TestimonialSlider } from '@/components/sections/TestimonialSlider';
import { ServicesExperience } from '@/components/sections/ServicesExperience';
import { LogoStrip } from '@/components/sections/LogoStrip';
import { ProjectGalleryTabs } from '@/components/sections/ProjectGalleryTabs';
import { HeroCinematicContent } from '@/components/home/HeroCinematicContent';
import GridMotion from '@/components/GridMotion';
import { chips, processSteps, journalTopics } from '@/lib/homeConstants';
import { getBlogThumbs, getFeaturedProjectImages, getGalleryFallbacks } from '@/lib/imageMap';

const heroHeadline = 'Design, Fit-Out, and Delivery Built to Win Client Confidence Instantly.';

export function HomeHeroSection({ heroImage, contact }) {
  const imagePool = Array.from(new Set([heroImage, ...getFeaturedProjectImages(), ...getGalleryFallbacks(), ...getBlogThumbs()].filter(Boolean)));
  const backgroundItems =
    imagePool.length > 0 ? Array.from({ length: 28 }, (_, index) => imagePool[index % imagePool.length]) : [];

  return (
    <section className='relative isolate overflow-hidden border-b border-mist bg-ink text-smoke'>
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <GridMotion items={backgroundItems} gradientColor='#d5d4d8' className='h-full w-full scale-[1.08]' />
      </div>
      <div className='pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/92 via-black/82 to-black/64' />
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_20%_26%,rgba(0,0,0,0.24),transparent_44%)]' />
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_22%_72%,rgba(0,0,0,0.58),transparent_52%)]' />
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(112deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.08)_34%,transparent_62%)]' />
      <Container className='relative z-10 flex min-h-[calc(100svh-5rem)] items-center py-12 lg:py-10'>
        <HeroCinematicContent contact={contact} chips={chips} headline={heroHeadline} />
      </Container>
    </section>
  );
}

export function HomeProofBarSection({ proofBarCopy }) {
  return (
    <section className='border-b border-mist bg-fog'>
      <Container className='py-4'>
        <p className='text-xs uppercase tracking-[0.2em] text-iron'>{proofBarCopy}</p>
      </Container>
    </section>
  );
}

export function HomeProcessSection() {
  return (
    <section className='border-b border-mist bg-white'>
      <Container className='py-8'>
        <div className='grid gap-3 md:grid-cols-6'>
          {processSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.04}>
              <article className='h-full border border-mist p-4'>
                <p className='text-[10px] uppercase tracking-[0.2em] text-iron'>0{index + 1}</p>
                <h2 className='mt-2 text-lg'>{step.title}</h2>
                <p className='mt-2 text-sm text-iron'>{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeServicesSection({ serviceImages }) {
  return <ServicesExperience serviceImages={serviceImages} />;
}

export function HomeProjectsSection({ featuredProjects }) {
  return (
    <section className='space-y-10'>
      <SectionTitle
        eyebrow='Featured Projects'
        title='Selected work across hospitality, residential, and workplace categories.'
        description='Every selected project combines strong visual identity with execution-ready detailing.'
      />
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.06}>
            <ProjectCard project={project} priority={index === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HomeAboutSection({ aboutImage }) {
  return (
    <section className='grid gap-8 border border-mist bg-white p-8 shadow-soft lg:grid-cols-[1.1fr_1fr] lg:items-center lg:p-12'>
      <div className='relative h-[360px] overflow-hidden border border-mist'>
        <Image src={aboutImage} alt='About Wanderlust Architects' fill sizes='(max-width: 1024px) 100vw, 50vw' className='object-cover grayscale' />
      </div>
      <div className='space-y-5'>
        <p className='text-xs uppercase tracking-[0.22em] text-iron'>About Studio</p>
        <h2 className='text-4xl leading-tight'>A multidisciplinary team focused on clear design decisions and reliable project outcomes.</h2>
        <p className='text-sm text-iron'>From architecture and interiors to office fit-outs and project delivery, we align design intent with build precision.</p>
        <Button href='/about' variant='ghost'>Discover Studio</Button>
      </div>
    </section>
  );
}

export function HomeGallerySection({ projects, galleryFallbacks }) {
  return (
    <section className='space-y-10'>
      <SectionTitle eyebrow='Project Gallery' title='Explore category-led visuals across our design and delivery spectrum.' />
      <ProjectGalleryTabs projects={projects} fallbackImages={galleryFallbacks} />
    </section>
  );
}

export function HomeTestimonialsSection() {
  return (
    <section className='space-y-10'>
      <SectionTitle eyebrow='Testimonials' title='What project partners say about our process.' />
      <TestimonialSlider />
    </section>
  );
}

export function HomeJournalSection({ latestBlogs }) {
  return (
    <section className='space-y-8'>
      <SectionTitle eyebrow='Latest Journal' title='Insights on architecture, fit-outs, and project delivery strategy.' />
      <div className='flex flex-wrap gap-2'>
        {journalTopics.map((topic) => (
          <Link
            key={topic}
            href={`/journal?tag=${encodeURIComponent(topic.toLowerCase())}`}
            className='rounded-md border border-mist px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-iron transition-colors hover:border-ink hover:text-ink'
          >
            {topic}
          </Link>
        ))}
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {latestBlogs.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} basePath='/journal' />
        ))}
      </div>
    </section>
  );
}

export function HomeBrandsSection({ logoImages }) {
  return <LogoStrip logos={logoImages} />;
}

export function HomeStatsSection() {
  return <StatsStrip />;
}
