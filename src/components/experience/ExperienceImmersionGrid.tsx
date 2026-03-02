import Image from 'next/image';
import Link from 'next/link';

type ExperienceProject = {
  slug: string;
  title: string;
  location: string;
  category: string;
  images: string[];
};

type ExperienceImmersionGridProps = {
  projects: ExperienceProject[];
};

const layout = [
  'col-span-12 row-span-2 md:col-span-8',
  'col-span-12 md:col-span-4',
  'col-span-12 md:col-span-4',
  'col-span-12 md:col-span-8'
];

export function ExperienceImmersionGrid({ projects }: ExperienceImmersionGridProps) {
  return (
    <section className='border-b border-mist bg-fog'>
      <div className='mx-auto max-w-[1800px] space-y-10 px-4 py-16 sm:px-8 lg:px-14 lg:py-24'>
        <div className='space-y-4 px-2'>
          <p className='text-[11px] uppercase tracking-[0.24em] text-iron'>Project Immersion</p>
          <h2 className='max-w-4xl text-4xl leading-tight sm:text-6xl'>A spatial selection where design quality and delivery logic remain indivisible.</h2>
        </div>

        <div className='grid auto-rows-[280px] grid-cols-12 gap-4 lg:auto-rows-[340px]'>
          {projects.slice(0, 4).map((project, index) => (
            <article key={project.slug} className={`${layout[index] || 'col-span-12 md:col-span-6'} group relative overflow-hidden border border-mist bg-black`}>
              <Link href={`/projects/${project.slug}`} className='absolute inset-0 z-30' aria-label={`Open ${project.title} project`} />
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                priority={index < 2}
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.02]'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95' />
              <div className='absolute inset-x-0 bottom-0 z-20 translate-y-2 p-6 text-white transition-transform duration-500 group-hover:translate-y-0'>
                <p className='text-[10px] uppercase tracking-[0.2em] text-silver'>{project.category}</p>
                <h3 className='mt-2 text-2xl leading-tight'>{project.title}</h3>
                <p className='mt-1 text-sm text-silver'>{project.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

