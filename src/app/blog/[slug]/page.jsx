import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { BlogArticle } from '@/components/sections/BlogArticle';
import { estimateReadTime, formatDate, getBlogBySlug, getBlogs } from '@/lib/content';

export async function generateStaticParams() {
  return getBlogs().map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const blog = getBlogBySlug(params.slug);
  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.title,
    description: `${blog.tags.join(', ')} insights by Wanderlust Architects`,
    openGraph: {
      title: blog.title,
      description: blog.tags.join(', '),
      images: [{ url: blog.coverImage, alt: blog.title }]
    }
  };
}

export default function BlogDetailPage({ params }) {
  const blog = getBlogBySlug(params.slug);

  if (!blog) notFound();

  return (
    <Container className='space-y-10 py-16 lg:py-24'>
      <header className='space-y-5 rounded-xl border border-mist bg-white p-8 shadow-soft lg:p-12'>
        <div className='relative h-72 overflow-hidden rounded-lg border border-mist'>
          <Image src={blog.coverImage} alt={blog.title} fill sizes='(max-width: 1024px) 100vw, 80vw' className='object-cover grayscale' />
        </div>
        <div className='flex flex-wrap gap-2'>
          {blog.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className='max-w-4xl text-4xl leading-tight lg:text-6xl'>{blog.title}</h1>
        <p className='text-xs uppercase tracking-[0.2em] text-iron'>
          {formatDate(blog.date)} | {estimateReadTime(blog.content)}
        </p>
      </header>
      <BlogArticle blog={blog} basePath='/blog' />
    </Container>
  );
}
