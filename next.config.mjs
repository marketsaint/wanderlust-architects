/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wanderlustarchitects.com'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/journal',
        permanent: true
      },
      {
        source: '/blog/:slug',
        destination: '/journal/:slug',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
