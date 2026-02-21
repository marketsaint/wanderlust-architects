import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className='mt-28 border-t border-mist bg-[#f0f0f0]'>
      <Container className='grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr]'>
        <div className='space-y-6'>
          <p className='text-xs uppercase tracking-[0.3em] text-iron'>Wanderlust Architects</p>
          <h3 className='max-w-xl text-4xl leading-tight'>Premium spatial design for residences, offices, hospitality, and high-precision project execution.</h3>
          <div className='flex flex-wrap gap-3'>
            <Link href='/contact' className='inline-flex rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
              Book Consultation
            </Link>
            <a href='https://wa.me/919999999999' className='inline-flex rounded-md border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
              WhatsApp
            </a>
          </div>
        </div>
        <div className='space-y-3'>
          <p className='text-xs uppercase tracking-[0.2em] text-iron'>Studios</p>
          <p className='text-sm'>Jaipur, Rajasthan</p>
          <p className='text-sm'>Gurgaon, Haryana</p>
          <p className='text-sm'>Surat, Gujarat</p>
        </div>
        <div className='space-y-3'>
          <p className='text-xs uppercase tracking-[0.2em] text-iron'>Connect</p>
          <Link href='/projects' className='block text-sm hover:text-iron'>Portfolio</Link>
          <Link href='/journal' className='block text-sm hover:text-iron'>Journal</Link>
          <a href='mailto:studio@wanderlustarchitects.com' className='block text-sm hover:text-iron'>studio@wanderlustarchitects.com</a>
          <a href='tel:+919999999999' className='block text-sm hover:text-iron'>+91 99999 99999</a>
        </div>
      </Container>
      <Container className='border-t border-mist py-6 text-xs uppercase tracking-[0.2em] text-iron'>
        <p>Copyright {new Date().getFullYear()} Wanderlust Architects. All rights reserved.</p>
      </Container>
    </footer>
  );
}
