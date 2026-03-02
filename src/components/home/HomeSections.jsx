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

const heroHeadline = 'Luxury Spatial Outcomes,\nDocumented for Real-\nWorld Execution.';

export function HomeHeroSection({ heroImage, contact }) {
  const imagePool = Array.from(new Set([heroImage, ...getFeaturedProjectImages(), ...getGalleryFallbacks(), ...getBlogThumbs()].filter(Boolean)));
  const backgroundItems =
    imagePool.length > 0 ? Array.from({ length: 28 }, (_, index) => imagePool[index % imagePool.length]) : [];

  return (
    <section id='home-hero' className='section-fade-edge relative isolate overflow-hidden border-b border-mist bg-ink text-smoke'>
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <GridMotion items={backgroundItems} gradientColor='#d5d4d8' className='h-full w-full scale-[1.08]' />
      </div>
      <div className='pointer-events-none absolute inset-0 z-[1] architect-hero-grid' />
      <div className='absolute inset-y-0 left-0 z-[1] hidden w-[44%] border-r border-white/10 lg:block' />
      <div className='pointer-events-none absolute inset-0 z-[1] architect-hero-beam' />
      <div className='pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/92 via-black/82 to-black/64' />
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_20%_26%,rgba(0,0,0,0.24),transparent_44%)]' />
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_22%_72%,rgba(0,0,0,0.58),transparent_52%)]' />
      <div className='pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(112deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.08)_34%,transparent_62%)]' />
      <Container className='relative z-10 flex min-h-[calc(100svh-5rem)] items-center py-12 lg:py-10'>
        <div className='architect-hero-frame mt-16 w-full px-6 py-10 sm:mt-20 sm:px-8 lg:mt-14 lg:px-10 lg:py-12'>
          <HeroCinematicContent contact={contact} chips={chips} headline={heroHeadline} />
        </div>
      </Container>
    </section>
  );
}

export function HomeProofBarSection({ proofBarCopy }) {
  return (
    <section className='section-fade-edge relative overflow-hidden border-b border-mist bg-fog'>
      <Container className='py-4'>
        <div className='architect-shell rounded-xl px-5 py-4'>
          <p className='relative z-[1] text-xs uppercase tracking-[0.2em] text-iron'>{proofBarCopy}</p>
        </div>
      </Container>
    </section>
  );
}

export function HomeProcessSection() {
  return (
    <section className='section-fade-edge relative isolate overflow-hidden border-b border-mist bg-[linear-gradient(180deg,#f8f8f8_0%,#f2f2f2_100%)]'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.86),transparent_44%),radial-gradient(circle_at_84%_80%,rgba(0,0,0,0.08),transparent_52%)]' />
      <Container className='relative py-8'>
        <div className='grid gap-3 md:grid-cols-6'>
          {processSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05} depth className='h-full'>
              <article className='architect-card group relative h-full rounded-xl p-4'>
                <span className='pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-zinc-900/0 via-zinc-900/60 to-zinc-900/0 transition-transform duration-500 ease-out group-hover:scale-x-100' />
                <span className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 [background:radial-gradient(220px_circle_at_18%_10%,rgba(255,255,255,0.72),transparent_58%)]' />
                <p className='relative z-[1] text-[10px] uppercase tracking-[0.22em] text-iron transition-colors duration-300 group-hover:text-zinc-800 [transform:translateZ(18px)]'>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className='relative z-[1] mt-2 text-lg transition-[transform,color] duration-500 ease-out group-hover:text-zinc-900 group-hover:[transform:translate3d(5px,0,20px)]'>
                  {step.title}
                </h2>
                <p className='relative z-[1] mt-2 text-sm text-iron transition-[transform,color] duration-500 ease-out group-hover:text-zinc-700 group-hover:[transform:translate3d(4px,0,16px)]'>
                  {step.description}
                </p>
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
    <section className='section-fade-edge architect-shell space-y-10 rounded-2xl p-8 lg:p-10'>
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
    <section className='architect-shell grid gap-8 rounded-2xl p-8 shadow-soft lg:grid-cols-[1.1fr_1fr] lg:items-center lg:p-12'>
      <div className='relative h-[360px] overflow-hidden rounded-xl border border-mist'>
        <Image src={aboutImage} alt='About Wanderlust Architects' fill sizes='(max-width: 1024px) 100vw, 50vw' className='object-cover grayscale' />
      </div>
      <div className='relative z-[1] space-y-5'>
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
    <section className='section-fade-edge architect-shell space-y-10 rounded-2xl p-8 lg:p-10'>
      <SectionTitle eyebrow='Project Gallery' title='Explore category-led visuals across our design and delivery spectrum.' />
      <ProjectGalleryTabs projects={projects} fallbackImages={galleryFallbacks} />
    </section>
  );
}

export function HomeTestimonialsSection() {
  return (
    <section className='architect-shell space-y-10 rounded-2xl p-8 lg:p-10'>
      <SectionTitle eyebrow='Testimonials' title='What project partners say about our process.' />
      <TestimonialSlider />
    </section>
  );
}

export function HomeJournalSection({ latestBlogs }) {
  return (
    <section className='section-fade-edge architect-shell space-y-8 rounded-2xl p-8 lg:p-10'>
      <SectionTitle eyebrow='Latest Blogs' title='Insights on architecture, fit-outs, and project delivery strategy.' />
      <div className='flex flex-wrap gap-2'>
        {journalTopics.map((topic) => (
          <Link
            key={topic}
            href={`/blog?tag=${encodeURIComponent(topic.toLowerCase())}`}
            className='rounded-md border border-mist px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-iron transition-colors hover:border-ink hover:text-ink'
          >
            {topic}
          </Link>
        ))}
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {latestBlogs.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} basePath='/blog' />
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
