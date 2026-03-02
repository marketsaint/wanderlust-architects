import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { BrandLogo } from '@/components/BrandLogo';

export function FooterPanel({ contact, compact = false }) {
  return (
    <>
      <Container className={`grid gap-12 ${compact ? 'py-10 lg:grid-cols-[1.2fr_1fr_1fr]' : 'py-16 lg:grid-cols-[1.3fr_1fr_1fr]'}`}>
        <div className='space-y-6'>
          <BrandLogo className='gap-3' iconClassName='h-10 w-10' textClassName='text-xs tracking-[0.22em]' />
          <h3 className='max-w-xl text-4xl leading-tight'>Premium spatial design for residences, offices, hospitality, and high-precision project execution.</h3>
          <div className='flex flex-wrap gap-3'>
            <Link href='/contact' className='inline-flex rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
              Book Consultation
            </Link>
            <a href={contact.whatsapp} className='inline-flex rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
              WhatsApp
            </a>
          </div>
        </div>
        <div className='space-y-3'>
          <p className='text-xs uppercase tracking-[0.2em] text-iron'>Studios</p>
          <p className='text-sm'>Jaipur, Rajasthan</p>
          <p className='text-sm'>Surat, Gujarat</p>
        </div>
        <div className='space-y-3'>
          <p className='text-xs uppercase tracking-[0.2em] text-iron'>Connect</p>
          <Link href='/projects' className='block text-sm hover:text-iron'>Portfolio</Link>
          <Link href='/blog' className='block text-sm hover:text-iron'>Blogs</Link>
          <a href={`mailto:${contact.email}`} className='block text-sm hover:text-iron'>{contact.email}</a>
          <a href={`tel:${contact.phone}`} className='block text-sm hover:text-iron'>{contact.phone}</a>
        </div>
      </Container>
    </>
  );
}
