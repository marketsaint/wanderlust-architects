import { headers } from 'next/headers';
import { Container } from '@/components/ui/Container';
import { getRegionFromHeaders } from '@/lib/region';
import { getContactByRegion } from '@/lib/contact';
import { FooterPanel } from '@/components/FooterPanel';

export async function Footer() {
  const requestHeaders = await headers();
  const region = getRegionFromHeaders(requestHeaders);
  const contact = getContactByRegion(region);

  return (
    <footer className='mt-28 border-t border-mist bg-[#f0f0f0]'>
      <FooterPanel contact={contact} />
      <Container className='border-t border-mist py-6 text-xs uppercase tracking-[0.2em] text-iron'>
        <p>Copyright {new Date().getFullYear()} Wanderlust Architects. All rights reserved.</p>
      </Container>
    </footer>
  );
}
