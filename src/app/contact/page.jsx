import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContactForm } from '@/components/sections/ContactForm';
import { Reveal } from '@/components/ui/Reveal';

export const metadata = {
  title: 'Contact',
  description: 'Contact Wanderlust Architects offices in Jaipur, Gurgaon, and Surat.'
};

const offices = [
  { city: 'Jaipur', address: 'C-Scheme, Jaipur, Rajasthan', phone: '+91 98765 40001' },
  { city: 'Gurgaon', address: 'Golf Course Road, Gurgaon, Haryana', phone: '+91 98765 40002' },
  { city: 'Surat', address: 'Athwa, Surat, Gujarat', phone: '+91 98765 40003' }
];

export default function ContactPage() {
  return (
    <Container className='space-y-12 py-16 lg:py-24'>
      <Reveal>
        <section className='rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
          <SectionTitle
            eyebrow='Contact'
            title='Discuss your project scope with our architecture and delivery team.'
            description='Share your goals and timelines. We will respond with the right design and execution pathway.'
          />
        </section>
      </Reveal>

      <div className='grid gap-4 md:grid-cols-3'>
        {offices.map((office, idx) => (
          <Reveal key={office.city} delay={idx * 0.05}>
            <article className='rounded-xl border border-mist bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-ink'>
              <h3 className='text-2xl'>{office.city}</h3>
              <p className='mt-2 text-sm text-iron'>{office.address}</p>
              <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className='mt-3 block text-xs uppercase tracking-[0.16em] text-iron hover:text-ink'>
                {office.phone}
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <ContactForm />

      <Link href='https://wa.me/919999999999' className='inline-flex rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
        WhatsApp us
      </Link>
    </Container>
  );
}
