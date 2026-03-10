import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { getProjectBySlug, getProjects, getRelatedProjects } from '@/lib/content';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlustarchitects.com').replace(/\/$/, '');

function sectionBlocks(project) {
  return [
    { id: 'overview', title: 'Project Overview', content: project.overview },
    { id: 'design-brief', title: 'Design Brief', content: project.designBrief },
    { id: 'architectural-concept', title: 'Architectural Concept', content: project.architecturalConcept },
    { id: 'spatial-planning', title: 'Spatial Planning', content: project.spatialPlanning },
    { id: 'material-palette', title: 'Material Palette', content: project.materialPalette },
    { id: 'lighting-strategy', title: 'Lighting Strategy', content: project.lightingStrategy },
    { id: 'user-experience', title: 'User Experience', content: project.userExperience },
    { id: 'execution-considerations', title: 'Execution Considerations', content: project.executionConsiderations },
    { id: 'project-outcome', title: 'Project Outcome', content: project.projectOutcome },
    { id: 'conclusion', title: 'Conclusion', content: project.conclusion }
  ];
}

export async function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.seoTitle || project.title,
    description: project.metaDescription || project.excerpt,
    alternates: {
      canonical: `${siteUrl}/projects/${project.slug}`
    },
    openGraph: {
      title: project.seoTitle || project.title,
      description: project.metaDescription || project.excerpt,
      url: `${siteUrl}/projects/${project.slug}`,
      images: [{ url: project.images[0], alt: project.heroImageAlt || project.title }]
    },
    keywords: project.seoKeywords || []
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const projects = getProjects();
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const related = getRelatedProjects(project.slug, project.category, 3);
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.h1 || project.title,
    headline: project.h1 || project.title,
    description: project.metaDescription || project.excerpt,
    keywords: project.seoKeywords,
    image: project.images,
    inLanguage: 'en',
    dateModified: project.updatedAt || new Date().toISOString(),
    creator: {
      '@type': 'Organization',
      name: 'Wanderlust Architects',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wanderlust Architects',
      url: siteUrl
    },
    mainEntityOfPage: `${siteUrl}/projects/${project.slug}`
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container className='space-y-14 py-16 lg:space-y-16 lg:py-24'>
        <section className='overflow-hidden rounded-xl border border-mist bg-white shadow-soft'>
          <div className='relative h-[52vh] min-h-[360px]'>
            <Image
              src={project.images[0]}
              alt={project.heroImageAlt || project.title}
              fill
              priority
              sizes='100vw'
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70' />
            <div className='absolute inset-x-0 bottom-0 p-8 text-white lg:p-12'>
              <p className='text-xs uppercase tracking-[0.2em] text-white/80'>{project.category}</p>
              <h1 className='mt-3 max-w-5xl text-3xl leading-tight lg:text-5xl'>{project.h1 || project.title}</h1>
              <p className='mt-4 max-w-4xl text-sm leading-relaxed text-white/85 lg:text-base'>{project.shortDescription}</p>
            </div>
          </div>
        </section>

        <section className='grid gap-8 lg:grid-cols-[1.35fr_0.8fr]'>
          <article className='space-y-8 rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-10'>
            {sectionBlocks(project).map((section) => (
              <section key={section.id} id={section.id} className='space-y-3'>
                <h2 className='text-2xl leading-tight lg:text-[1.9rem]'>{section.title}</h2>
                <p className='text-sm leading-relaxed text-iron lg:text-[15px]'>{section.content}</p>
              </section>
            ))}
          </article>

          <aside className='h-fit space-y-6 rounded-xl border border-mist bg-white p-6 shadow-soft lg:sticky lg:top-24'>
            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-iron'>Project Snapshot</p>
              <dl className='mt-4 space-y-3 text-sm'>
                <div>
                  <dt className='text-xs uppercase tracking-[0.18em] text-iron'>Project</dt>
                  <dd>{project.title}</dd>
                </div>
                <div>
                  <dt className='text-xs uppercase tracking-[0.18em] text-iron'>Type</dt>
                  <dd>{project.projectType}</dd>
                </div>
                <div>
                  <dt className='text-xs uppercase tracking-[0.18em] text-iron'>Category</dt>
                  <dd>{project.category}</dd>
                </div>
                <div>
                  <dt className='text-xs uppercase tracking-[0.18em] text-iron'>Location</dt>
                  <dd>{project.location}</dd>
                </div>
                <div>
                  <dt className='text-xs uppercase tracking-[0.18em] text-iron'>Image Name</dt>
                  <dd>{project.imageName}</dd>
                </div>
              </dl>
            </div>

            <div className='border-t border-mist pt-4'>
              <p className='text-xs uppercase tracking-[0.2em] text-iron'>SEO Keywords</p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {(project.seoKeywords || []).map((item) => (
                  <span key={item} className='rounded-full border border-mist bg-pearl px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-iron'>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className='border-t border-mist pt-4'>
              <p className='text-xs uppercase tracking-[0.2em] text-iron'>Useful Links</p>
              <div className='mt-3 flex flex-col gap-2 text-sm'>
                {project.internalLinks?.map((href) => (
                  <Link key={href} href={href} className='rounded-md border border-mist px-3 py-2 transition hover:border-ink'>
                    {href}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className='rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-10'>
          <SectionTitle
            eyebrow='Start A Similar Project'
            title='Need design and delivery clarity for your next project?'
            description='Discuss your project scope with Wanderlust Architects and get a structured concept-to-execution roadmap.'
          />
          <div className='mt-6 flex flex-wrap gap-3'>
            <Link href='/contact' className='rounded-md border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-black'>Contact Studio</Link>
            <Link href='/projects' className='rounded-md border border-mist px-6 py-3 text-xs uppercase tracking-[0.18em] transition hover:border-ink'>View All Projects</Link>
          </div>
        </section>

        <section className='space-y-8'>
          <SectionTitle eyebrow='Related Projects' title='You may also like' />
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {related.map((item) => (
              <ProjectCard key={item.slug} project={item} />
            ))}
          </div>
        </section>

        <nav className='flex flex-wrap gap-4 border-t border-mist pt-6 text-xs uppercase tracking-[0.2em]'>
          {prevProject ? (
            <Link href={`/projects/${prevProject.slug}`} className='rounded-lg border border-mist px-4 py-3 transition hover:border-ink'>
              Prev: {prevProject.title}
            </Link>
          ) : null}
          {nextProject ? (
            <Link href={`/projects/${nextProject.slug}`} className='rounded-lg border border-mist px-4 py-3 transition hover:border-ink'>
              Next: {nextProject.title}
            </Link>
          ) : null}
        </nav>
      </Container>
    </>
  );
}
