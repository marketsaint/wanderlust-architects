import blogs from '@/data/blogs.json';
import { projectEntries } from '@/content/projects';
import { getAllUniqueImages, pickBestImageByHint, getImageDataset } from '@/lib/images';
import {
  getAboutImage,
  getBlogThumbs,
  getHeroImage as getMappedHeroImage,
  getImagesForHint,
  getServiceHeroImage
} from '@/lib/imageMap';

let cachedProjects = null;
let cachedBlogs = null;
let cachedAllUnique = null;
let cachedImageAtlas = null;

function rotatePool(pool, offset, count) {
  if (!pool.length) return [];
  const start = offset % pool.length;
  return [...pool.slice(start), ...pool.slice(0, start)].slice(0, count);
}

function assignBlogCover(blog, index, fallbackPool) {
  const matched = getImagesForHint([blog.title, blog.slug, 'blog', ...blog.tags], 2);
  const thumbs = getBlogThumbs();
  const override = thumbs.length ? thumbs[index % thumbs.length] : null;
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
    cachedProjects = [...projectEntries]
      .map((entry, index) => {
        const conceptLead = entry.architecturalConcept.split('.').shift()?.trim() || entry.projectType;
        return {
          ...entry,
          type: entry.projectType,
          concept: conceptLead,
          excerpt: entry.shortDescription,
          description: [entry.overview, entry.designBrief, entry.projectOutcome],
          images: [entry.coverImage],
          sortOrder: projectEntries.length - index
        };
      })
      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));
  }

  return cachedProjects;
}

export function getProjectBySlug(slug) {
  return getProjects().find((project) => project.slug === slug);
}

export function getRelatedProjects(slug, category, limit = 3) {
  const related = getProjects().filter((project) => project.slug !== slug && project.category === category);
  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const fallback = getProjects().filter((project) => project.slug !== slug && project.category !== category);
  return [...related, ...fallback].slice(0, limit);
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
