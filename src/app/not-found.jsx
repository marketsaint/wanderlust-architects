import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className='space-y-4 py-24 text-center'>
      <p className='text-xs uppercase tracking-[0.2em] text-iron'>404</p>
      <h1 className='text-5xl'>Page not found</h1>
      <p className='text-sm text-iron'>The page you are looking for does not exist.</p>
      <Link href='/' className='inline-flex border border-ink px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-ink hover:text-smoke'>
        Back to Home
      </Link>
    </Container>
  );
}
