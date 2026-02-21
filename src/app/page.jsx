import Image from 'next/image';
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
import {
  getAboutPreviewImage,
  getBlogs,
  getHeroImage,
  getProjects,
  getServiceImage
} from '@/lib/content';
import {
  getBlogThumbs,
  getClientLogos,
  getFeaturedProjectImages,
  getGalleryFallbacks
} from '@/lib/imageMap';

const chips = ['Fast turnaround', 'Execution-ready detailing', 'Single-point ownership'];
const serviceOrder = [
  'Architecture Design',
  'Interior Design',
  'Office Fit-Outs',
  'Project Delivery',
  'Building Documentation',
  'Landscape Design'
];

export default function HomePage() {
  const projects = getProjects();
  const blogs = getBlogs();
  const heroImage = getHeroImage();
  const aboutImage = getAboutPreviewImage();
  const featuredImages = getFeaturedProjectImages();
  const logoImages = getClientLogos();
  const galleryFallbacks = getGalleryFallbacks();
  const blogThumbs = getBlogThumbs();
  const serviceImages = serviceOrder.reduce((acc, service) => {
    acc[service] = getServiceImage(service);
    return acc;
  }, {});

  const featuredProjects = projects.slice(0, 3).map((project, index) => ({
    ...project,
    images: [featuredImages[index] || project.images[0], ...(project.images || []).slice(1)]
  }));

  const latestBlogs = blogs.slice(0, 3).map((blog, index) => ({
    ...blog,
    coverImage: blogThumbs[index] || blog.coverImage
  }));

  return (
    <>
      <section className='relative isolate overflow-hidden border-b border-mist bg-ink text-smoke'>
        <div className='absolute inset-0'>
          <Image src={heroImage} alt='Wanderlust Architects hero' fill priority className='object-cover opacity-35 grayscale' />
        </div>
        <div className='absolute inset-0 bg-gradient-to-r from-black/88 via-black/72 to-black/38' />
        <Container className='relative py-24 sm:py-32 lg:py-40'>
          <Reveal>
            <p className='text-xs uppercase tracking-[0.25em] text-silver'>Wanderlust Architects</p>
            <h1 className='mt-6 max-w-5xl text-4xl leading-[1.04] sm:text-6xl lg:text-7xl'>
              Design, Fit-Out, and Delivery Built to Win Client Confidence Instantly.
            </h1>
            <p className='mt-6 max-w-2xl text-sm text-silver sm:text-base'>
              We craft premium architecture and interiors with clear execution pathways from concept approval to final handover.
            </p>
            <div className='mt-10 flex flex-wrap gap-3'>
              <Button href='/projects'>Explore Projects</Button>
              <Button href='/contact' variant='ghost'>Start Project</Button>
            </div>
            <div className='mt-8 grid max-w-3xl gap-3 sm:grid-cols-3'>
              {chips.map((chip, index) => (
                <Reveal key={chip} delay={index * 0.08}>
                  <div className='border border-white/25 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em]'>
                    {chip}
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className='space-y-24 py-20 lg:py-24'>
        <ServicesExperience serviceImages={serviceImages} />

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

        <LogoStrip logos={logoImages} />

        <section className='space-y-10'>
          <SectionTitle
            eyebrow='Project Gallery'
            title='Explore category-led visuals across our design and delivery spectrum.'
          />
          <ProjectGalleryTabs projects={projects} fallbackImages={galleryFallbacks} />
        </section>

        <section>
          <StatsStrip />
        </section>

        <section className='space-y-10'>
          <SectionTitle eyebrow='Testimonials' title='What project partners say about our process.' />
          <TestimonialSlider />
        </section>

        <section className='space-y-10'>
          <SectionTitle eyebrow='Latest Journal' title='Insights on architecture, fit-outs, and project delivery strategy.' />
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {latestBlogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} basePath='/journal' />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
