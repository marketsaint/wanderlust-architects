import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { getServiceImage } from '@/lib/content';
import { imageMap } from '@/lib/imageMap';

export const metadata = {
  title: 'Dubai',
  description:
    'Luxury architecture, interior design, office fit-outs, and project delivery services for Dubai and UAE clients.',
  openGraph: {
    title: 'Wanderlust Architects Dubai',
    description: 'Architecture, interiors, and fit-out execution services in Dubai.',
    images: [{ url: imageMap.blogThumbs[2], alt: 'Wanderlust Architects Dubai' }]
  }
};

const services = [
  {
    title: 'Architecture Design',
    copy: 'Context-aware architecture concepts tailored for premium residential and hospitality projects in Dubai.'
  },
  {
    title: 'Interior Design',
    copy: 'Editorial interior environments with strong material direction, lighting hierarchy, and user experience clarity.'
  },
  {
    title: 'Office Fit-Outs',
    copy: 'Fast-track workplace fit-outs with brand-led planning, execution-ready detailing, and contractor coordination.'
  },
  {
    title: 'Project Delivery',
    copy: 'Single-point project delivery support from design approvals to site execution and handover management.'
  }
];

const sectors = ['Villas', 'Hospitality', 'Corporate Offices', 'Retail', 'Mixed Use'];

export default function DubaiLandingPage() {
  const hero = imageMap.blogThumbs[2];
  const architecture = getServiceImage('Architecture Design');
  const interior = getServiceImage('Interior Design');
  const fitout = getServiceImage('Office Fit-Outs') || getServiceImage('Project Delivery');

  return (
    <>
      <section className='relative isolate overflow-hidden border-b border-mist bg-ink text-smoke'>
        <div className='absolute inset-0'>
          <Image src={hero} alt='Wanderlust Architects Dubai' fill priority sizes='100vw' className='object-cover opacity-35 grayscale' />
        </div>
        <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/35' />
        <Container className='relative py-24 sm:py-32 lg:py-40'>
          <Reveal>
            <p className='text-xs uppercase tracking-[0.26em] text-silver'>Dubai</p>
            <h1 className='mt-6 max-w-5xl text-4xl leading-[1.04] sm:text-6xl lg:text-7xl'>
              Premium Architecture and Interiors for Dubai Projects That Need Fast, Reliable Execution.
            </h1>
            <p className='mt-6 max-w-2xl text-sm text-silver sm:text-base'>
              We support Dubai clients with design clarity, fit-out readiness, and delivery discipline from concept to handover.
            </p>
            <div className='mt-10 flex flex-wrap gap-3'>
              <Button href='/contact'>Book Dubai Consultation</Button>
              <Button href='/projects' variant='ghost'>Explore Work</Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className='space-y-20 py-16 lg:py-24'>
        <section className='grid gap-5 md:grid-cols-3'>
          {[
            'Turnaround-focused concept development',
            'Execution-ready documentation standards',
            'Single-point communication for delivery'
          ].map((item, index) => (
            <Reveal key={item} delay={index * 0.06}>
              <article className='rounded-xl border border-mist bg-white p-5 shadow-soft'>
                <p className='text-xs uppercase tracking-[0.18em] text-iron'>{item}</p>
              </article>
            </Reveal>
          ))}
        </section>

        <section className='space-y-10'>
          <SectionTitle
            eyebrow='Services in Dubai'
            title='Design and delivery services tailored for high-expectation regional clients.'
            description='Our workflows are built for investor, end-user, and developer confidence.'
          />
          <div className='grid gap-6 lg:grid-cols-2'>
            {services.map((service, index) => {
              const image =
                service.title === 'Architecture Design'
                  ? architecture
                  : service.title === 'Interior Design'
                    ? interior
                    : fitout;

              return (
                <Reveal key={service.title} delay={index * 0.07}>
                  <article className='overflow-hidden rounded-xl border border-mist bg-white shadow-soft'>
                    <div className='relative h-56'>
                      <Image src={image} alt={service.title} fill sizes='(max-width: 1024px) 100vw, 50vw' className='object-cover grayscale' />
                    </div>
                    <div className='space-y-3 p-6'>
                      <h3 className='text-3xl leading-tight'>{service.title}</h3>
                      <p className='text-sm text-iron'>{service.copy}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className='grid gap-8 rounded-xl border border-mist bg-white p-8 shadow-soft lg:grid-cols-[1.1fr_1fr] lg:p-12'>
          <div>
            <SectionTitle
              eyebrow='Sector Focus'
              title='Where we create measurable value in the Dubai market.'
              description='Our approach balances visual quality with buildability, program logic, and delivery velocity.'
            />
            <div className='mt-6 flex flex-wrap gap-2'>
              {sectors.map((sector) => (
                <span key={sector} className='rounded-md border border-mist px-4 py-2 text-xs uppercase tracking-[0.16em] text-iron'>
                  {sector}
                </span>
              ))}
            </div>
          </div>
          <div className='relative h-80 overflow-hidden rounded-lg border border-mist'>
            <Image src={imageMap.featuredProjects[0]} alt='Dubai sector work visual' fill sizes='(max-width: 1024px) 100vw, 40vw' className='object-cover grayscale' />
          </div>
        </section>

        <section className='rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
          <SectionTitle
            eyebrow='Start in 24 Hours'
            title='Send your Dubai project brief and receive a tailored response with next-step scope.'
            description='Share project type, location, timeline, and budget range for faster alignment.'
          />
          <div className='mt-8 flex flex-wrap gap-3'>
            <Button href='/contact'>Talk to Team</Button>
            <Link
              href='https://wa.me/919999999999'
              className='inline-flex rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'
            >
              WhatsApp
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
