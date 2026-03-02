import { headers } from 'next/headers';
import { getContactByRegion } from '@/lib/contact';
import { getRegionFromHeaders } from '@/lib/region';
import { getAboutPreviewImage, getBlogs, getHeroImage, getProjects, getServiceImage } from '@/lib/content';
import { getBlogThumbs, getClientLogos, getFeaturedProjectImages, getGalleryFallbacks } from '@/lib/imageMap';
import { serviceOrder } from '@/lib/homeConstants';
import type { HomePayload } from '@/lib/homeTypes';

export async function getHomePayload(): Promise<HomePayload> {
  const requestHeaders = await headers();
  const region = getRegionFromHeaders(requestHeaders);
  const contact = getContactByRegion(region);

  const projects = getProjects();
  const blogs = getBlogs();
  const heroImage = getHeroImage();
  const aboutImage = getAboutPreviewImage();
  const featuredImages = getFeaturedProjectImages();
  const logoImages = getClientLogos();
  const galleryFallbacks = getGalleryFallbacks();
  const blogThumbs = getBlogThumbs();

  const serviceImages = serviceOrder.reduce<Record<string, string>>((acc, service) => {
    acc[service] = getServiceImage(service) || heroImage;
    return acc;
  }, {});

  const featuredProjects = projects.slice(0, 3).map((project, index) => ({
    ...project,
    images: [featuredImages[index] || project.images[0], ...(project.images || []).slice(1)]
  }));

  const latestBlogs = blogs.slice(0, 3).map((blog, index) => ({
    ...blog,
    coverImage: blogThumbs[index] || blog.coverImage
  }));

  const proofBarCopy =
    region === 'AE'
      ? 'Built for Dubai, UAE timelines with luxury design intent, technical clarity, and delivery discipline.'
      : region === 'IN'
        ? 'Trusted for Jaipur and Rajasthan execution with drawing precision, on-site alignment, and milestone accountability.'
        : 'Trusted for luxury design and delivery with clear documentation, regional coordination, and build-ready outputs.';

  return {
    region,
    contact,
    heroImage,
    aboutImage,
    projects,
    featuredProjects,
    latestBlogs,
    logoImages,
    galleryFallbacks,
    serviceImages,
    proofBarCopy
  };
}
