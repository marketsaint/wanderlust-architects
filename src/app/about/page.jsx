import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TestimonialSlider } from '@/components/sections/TestimonialSlider';
import { Reveal } from '@/components/ui/Reveal';
import { getAboutPreviewImage } from '@/lib/content';
import { getTeamImages } from '@/lib/imageMap';

export const metadata = {
  title: 'About',
  description: 'Luxury architecture and interior practice with execution-first project delivery.'
};

const team = [
  { name: 'Nikhil Arora', role: 'Principal Architect' },
  { name: 'Shreyeshi Sharma', role: 'Director - Interiors' },
  { name: 'Uday Singh', role: 'Lead - Project Delivery' }
];

export default function AboutPage() {
  const aboutImage = getAboutPreviewImage();
  const teamImages = getTeamImages();

  return (
    <Container className='space-y-24 py-16 lg:py-24'>
      <Reveal>
        <section className='grid gap-8 rounded-xl border border-mist bg-white p-8 shadow-soft lg:grid-cols-[1.2fr_1fr] lg:p-12'>
          <SectionTitle
            eyebrow='About Studio'
            title='Architecture is where we belong.'
            description='We shape premium environments through architecture, interior design, office fit-outs, and structured project delivery.'
          />
          <div className='relative h-72 overflow-hidden rounded-lg border border-mist lg:h-full'>
            <Image src={aboutImage} alt='Wanderlust Architects studio image' fill sizes='(max-width: 1024px) 100vw, 40vw' className='object-cover grayscale' />
          </div>
        </section>
      </Reveal>

      <section className='grid gap-5 md:grid-cols-2'>
        <Reveal>
          <article className='rounded-xl border border-mist bg-white p-6 shadow-soft'>
            <p className='text-xs uppercase tracking-[0.2em] text-iron'>Mission</p>
            <p className='mt-3 text-sm text-iron'>Deliver high-performance, high-impact spaces that balance design distinction with execution reliability.</p>
          </article>
        </Reveal>
        <Reveal delay={0.08}>
          <article className='rounded-xl border border-mist bg-white p-6 shadow-soft'>
            <p className='text-xs uppercase tracking-[0.2em] text-iron'>Vision</p>
            <p className='mt-3 text-sm text-iron'>Build a benchmark design-delivery studio trusted by clients for clarity, speed, and refined outcomes.</p>
          </article>
        </Reveal>
      </section>

      <section className='space-y-8'>
        <SectionTitle eyebrow='Team' title='Leadership focused on design quality and project outcomes.' />
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {team.map((member, idx) => (
            <Reveal key={member.name} delay={idx * 0.06}>
              <article className='rounded-xl border border-mist bg-white p-6 shadow-soft'>
                <div className='relative mb-4 h-60 overflow-hidden rounded-md border border-mist'>
                  <Image src={teamImages[idx] || aboutImage} alt={member.name} fill sizes='(max-width: 1024px) 100vw, 33vw' className='object-cover grayscale' />
                </div>
                <h3 className='text-2xl'>{member.name}</h3>
                <p className='text-xs uppercase tracking-[0.2em] text-iron'>{member.role}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className='space-y-6'>
        <SectionTitle eyebrow='Client Voice' title='Trusted by private and commercial clients across India.' />
        <TestimonialSlider />
      </section>
    </Container>
  );
}
