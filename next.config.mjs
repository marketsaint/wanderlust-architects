/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wanderlustarchitects.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/journal',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/journal/:slug',
        destination: '/blog/:slug',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
