import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization
  images: {
    // Prefer modern formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Optimize device sizes for responsiveness
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'www.altexsoft.com',
      },
      {
        protocol: 'https',
        hostname: 'www.traininginbangalore.com',
      },
    ],
  },

  // Enable gzip compression
  compress: true,

  // Optimize package imports for tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'date-fns'],
  },

  // Production source maps disabled for smaller bundles
  productionBrowserSourceMaps: false,

  // Powered by header disabled
  poweredByHeader: false,
};

export default nextConfig;
