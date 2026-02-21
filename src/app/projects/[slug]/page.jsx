import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { getProjectBySlug, getProjects, getRelatedProjects } from '@/lib/content';

export async function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: [{ url: project.images[0], alt: project.title }]
    }
  };
}

export default function ProjectDetailPage({ params }) {
  const projects = getProjects();
  const project = getProjectBySlug(params.slug);

  if (!project) notFound();

  const related = getRelatedProjects(project.slug, project.category, 3);
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <Container className='space-y-14 py-16 lg:py-24'>
      <section className='rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
        <SectionTitle eyebrow={project.category} title={project.title} description={project.excerpt} />
      </section>

      <section className='grid gap-8 lg:grid-cols-[1.45fr_1fr]'>
        <div className='space-y-4'>
          {project.images.map((src, index) => (
            <div key={`${src}-${index}`} className='relative h-[380px] overflow-hidden rounded-lg border border-mist bg-white'>
              <Image src={src} alt={`${project.title} image ${index + 1}`} fill sizes='(max-width: 1024px) 100vw, 65vw' className='object-cover grayscale transition duration-700 hover:grayscale-0' />
            </div>
          ))}
        </div>
        <aside className='h-fit rounded-xl border border-mist bg-white p-6 shadow-soft lg:sticky lg:top-24'>
          <p className='text-xs uppercase tracking-[0.2em] text-iron'>Project Facts</p>
          <dl className='mt-5 space-y-4 text-sm'>
            <div><dt className='text-xs uppercase tracking-[0.18em] text-iron'>Name</dt><dd>{project.title}</dd></div>
            <div><dt className='text-xs uppercase tracking-[0.18em] text-iron'>Concept</dt><dd>{project.concept}</dd></div>
            <div><dt className='text-xs uppercase tracking-[0.18em] text-iron'>Location</dt><dd>{project.location}</dd></div>
            <div><dt className='text-xs uppercase tracking-[0.18em] text-iron'>Date</dt><dd>{project.year}</dd></div>
            <div><dt className='text-xs uppercase tracking-[0.18em] text-iron'>Category</dt><dd>{project.category}</dd></div>
          </dl>
        </aside>
      </section>

      <section className='space-y-4 rounded-xl border border-mist bg-white p-8 shadow-soft'>
        <h2 className='text-3xl'>Project Narrative</h2>
        {project.description.map((paragraph, index) => (
          <p key={index} className='text-sm leading-relaxed text-iron'>
            {paragraph}
          </p>
        ))}
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
        {prevProject ? <Link href={`/projects/${prevProject.slug}`} className='rounded-lg border border-mist px-4 py-3 hover:border-ink'>Prev: {prevProject.title}</Link> : null}
        {nextProject ? <Link href={`/projects/${nextProject.slug}`} className='rounded-lg border border-mist px-4 py-3 hover:border-ink'>Next: {nextProject.title}</Link> : null}
      </nav>
    </Container>
  );
}
