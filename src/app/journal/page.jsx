import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BlogListClient } from '@/components/sections/BlogListClient';
import { getBlogs } from '@/lib/content';

export const metadata = {
  title: 'Journal',
  description: 'Insights on architecture, interiors, office fit-outs, and project delivery.'
};

export default function JournalPage() {
  const blogs = getBlogs();

  return (
    <Container className='space-y-12 py-16 lg:py-24'>
      <section className='rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
        <SectionTitle
          eyebrow='Journal'
          title='Design intelligence for clients planning high-value spaces.'
          description='Read practical strategy on architecture, interior systems, fit-outs, and execution planning.'
        />
      </section>
      <BlogListClient blogs={blogs} basePath='/journal' />
    </Container>
  );
}
