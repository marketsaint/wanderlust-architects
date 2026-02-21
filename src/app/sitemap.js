import { getBlogs, getProjects } from '@/lib/content';

export default function sitemap() {
  const base = 'https://wanderlustarchitects.com';

  const staticPages = ['', '/india', '/dubai', '/about', '/projects', '/journal', '/career', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8
  }));

  const projectPages = getProjects().map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: new Date(`${project.year}-12-31`),
    changeFrequency: 'monthly',
    priority: 0.75
  }));

  const journalPages = getBlogs().map((blog) => ({
    url: `${base}/journal/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  return [...staticPages, ...projectPages, ...journalPages];
}
