export type ContactInfo = {
  phone: string;
  whatsapp: string;
  email: string;
};

export type HomePayload = {
  region: 'IN' | 'AE' | 'OTHER';
  contact: ContactInfo;
  heroImage: string;
  aboutImage: string;
  projects: any[];
  featuredProjects: any[];
  latestBlogs: any[];
  logoImages: string[];
  galleryFallbacks: string[];
  serviceImages: Record<string, string>;
  proofBarCopy: string;
};
