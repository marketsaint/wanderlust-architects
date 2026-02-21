import projects from '@/data/projects.json';
import blogs from '@/data/blogs.json';
import { getAllUniqueImages, pickBestImageByHint, pickBestImagesByService, getImageDataset } from '@/lib/images';
import {
  getAboutImage,
  getBlogThumbs,
  getFeaturedProjectImages,
  getGalleryFallbacks,
  getHeroImage as getMappedHeroImage,
  getImagesForHint,
  getServiceHeroImage
} from '@/lib/imageMap';

let cachedProjects = null;
let cachedBlogs = null;
let cachedAllUnique = null;
let cachedImageAtlas = null;

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function rotatePool(pool, offset, count) {
  if (!pool.length) return [];
  const start = offset % pool.length;
  return [...pool.slice(start), ...pool.slice(0, start)].slice(0, count);
}

function projectHints(project) {
  return [project.title, project.slug, project.category, project.location, project.type, project.concept];
}

function assignProjectImages(project, index, fallbackPool) {
  const matched = getImagesForHint(projectHints(project), 6);
  const serviceMatched = pickBestImagesByService(project.category, 4);
  const featured = getFeaturedProjectImages();
  const fallbacks = getGalleryFallbacks();
  return unique([...matched, ...serviceMatched, ...featured, ...fallbacks, ...rotatePool(fallbackPool, index * 7, 6)]).slice(0, 6);
}

function assignBlogCover(blog, index, fallbackPool) {
  const matched = getImagesForHint([blog.title, blog.slug, 'blog', ...blog.tags], 2);
  const override = getBlogThumbs()[index % getBlogThumbs().length];
  const fallback = rotatePool(fallbackPool, index * 5, 1)[0];
  return matched[0] || override || fallback;
}

function getAllUniqueCached() {
  if (!cachedAllUnique) {
    cachedAllUnique = getAllUniqueImages();
  }
  return cachedAllUnique;
}

export function getImageAtlas() {
  if (!cachedImageAtlas) {
    cachedImageAtlas = getImageDataset().allUnique;
  }
  return cachedImageAtlas;
}

export function getHeroImage() {
  return getMappedHeroImage() || getAllUniqueCached()[0];
}

export function getAboutPreviewImage() {
  return getAboutImage() || getAllUniqueCached()[1];
}

export function getServiceImage(serviceName) {
  return getServiceHeroImage(serviceName) || pickBestImageByHint([serviceName, 'service']);
}

export function getClientLogoImages() {
  return getImageDataset().allUnique
    .map((item) => item.url)
    .filter((url) => /logo|brand|png/i.test(url))
    .slice(0, 8);
}

export function getProjects() {
  if (!cachedProjects) {
    const pool = getAllUniqueCached();
    cachedProjects = [...projects]
      .map((project, index) => ({
        ...project,
        images: assignProjectImages(project, index, pool)
      }))
      .sort((a, b) => Number(b.year) - Number(a.year));
  }

  return cachedProjects;
}

export function getProjectBySlug(slug) {
  return getProjects().find((project) => project.slug === slug);
}

export function getRelatedProjects(slug, category, limit = 3) {
  return getProjects()
    .filter((project) => project.slug !== slug && project.category === category)
    .slice(0, limit);
}

export function getBlogs() {
  if (!cachedBlogs) {
    const pool = getAllUniqueCached();
    cachedBlogs = [...blogs]
      .map((blog, index) => ({
        ...blog,
        coverImage: assignBlogCover(blog, index, pool)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return cachedBlogs;
}

export function getBlogBySlug(slug) {
  return getBlogs().find((blog) => blog.slug === slug);
}

export function getJournalBySlug(slug) {
  return getBlogBySlug(slug);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function estimateReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(2, Math.ceil(words / 200))} min read`;
}
