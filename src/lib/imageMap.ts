import { pickBestImageByHint, pickBestImagesByService, pickManyByHint } from '@/lib/images';

export const imageMap = {
  hero: 'https://wanderlustarchitects.com/wp-content/uploads/2023/05/Enscape_2023-08-24-17-53-19-scaled.jpg',
  about: 'https://wanderlustarchitects.com/wp-content/uploads/2023/06/about-bg-02.jpg',
  featuredProjects: [
    'https://wanderlustarchitects.com/wp-content/uploads/2024/11/PENTHOUSE-JAIPUR9.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/04/THE-BAAGH-BANQUET-E-10042025--scaled.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2023/11/ANJUNA-VILLA-GOA9.jpg'
  ],
  projectGalleryFallbacks: [
    'https://wanderlustarchitects.com/wp-content/uploads/2025/04/luxury-resort-architect-rajasthan.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2024/10/MUM-03-1.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/03/PROPEX-01.jpg'
  ],
  servicesHero: {
    'Architecture Design': 'https://wanderlustarchitects.com/wp-content/uploads/2023/05/Enscape_2023-08-24-18-12-48-scaled-e1719249272569.jpg',
    'Interior Design': 'https://wanderlustarchitects.com/wp-content/uploads/2023/05/JBO_MD-CABIN-01.jpg',
    'Building Documentation': 'https://wanderlustarchitects.com/wp-content/uploads/2024/11/PROPOSED-PARKING-PLAN-LINE-DRAWING-copy-scaled.webp',
    'Landscape Design': 'https://wanderlustarchitects.com/wp-content/uploads/2023/05/LANDSCAPE-01.jpg',
    '3D Modelling': 'https://wanderlustarchitects.com/wp-content/uploads/2023/03/post-bg-05.jpg'
  },
  blogThumbs: [
    'https://wanderlustarchitects.com/wp-content/uploads/2026/01/best-architects-in-jaipur-ai-featured-image.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2026/01/best-heritage-hotel-architects-in-rajasthan-wanderlust-architects.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2026/01/wanderlust-architects-dubai-office-ibn-battuta-interior-design-studio.jpg'
  ],
  team: [
    'https://wanderlustarchitects.com/wp-content/uploads/2025/03/raisar-bw.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/03/shreyeshi.jpg',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/03/uday-scaled.jpg'
  ],
  clientLogos: [
    'https://wanderlustarchitects.com/wp-content/uploads/2025/04/ananta-logo-1-1.png',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/04/hoztel-1.png',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/04/jaiwik-1.png',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/04/samsung-1.png',
    'https://wanderlustarchitects.com/wp-content/uploads/2025/04/tea-tradition-1.png'
  ]
};

function withFallback(primary, hints = []) {
  if (primary) return primary;
  return pickBestImageByHint(hints);
}

export function getHeroImage() {
  return withFallback(imageMap.hero, ['home', 'hero', 'architecture']);
}

export function getAboutImage() {
  return withFallback(imageMap.about, ['about', 'studio']);
}

export function getFeaturedProjectImages() {
  return imageMap.featuredProjects;
}

export function getServiceHeroImage(serviceName) {
  const direct = imageMap.servicesHero[serviceName];
  if (direct) return direct;
  return pickBestImagesByService(serviceName, 1)[0] || pickBestImageByHint([serviceName, 'service']);
}

export function getGalleryFallbacks() {
  return imageMap.projectGalleryFallbacks;
}

export function getBlogThumbs() {
  return imageMap.blogThumbs;
}

export function getTeamImages() {
  return imageMap.team;
}

export function getClientLogos() {
  return imageMap.clientLogos;
}

export function getImagesForHint(hints, limit = 12) {
  return pickManyByHint(hints, limit);
}
