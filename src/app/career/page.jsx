import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';

export const metadata = {
  title: 'Career',
  description: 'Join Wanderlust Architects for architecture, interiors, fit-outs, and project delivery assignments.'
};

export default function CareerPage() {
  return (
    <Container className='py-16 lg:py-24'>
      <Reveal>
        <section className='space-y-6 rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
          <SectionTitle
            eyebrow='Career'
            title='We hire designers and project thinkers with sharp taste and strong technical discipline.'
            description='If you are serious about design quality and buildability, send your portfolio and role interest.'
          />
          <Link href='mailto:careers@wanderlustarchitects.com' className='inline-flex rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
            careers@wanderlustarchitects.com
          </Link>
        </section>
      </Reveal>
    </Container>
  );
}
