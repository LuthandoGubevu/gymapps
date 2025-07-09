
import type {NextConfig} from 'next';
import withPWA from '@ducanh2912/next-pwa';

const pwaPlugin = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
  fallbacks: {
    document: '/offline',
  },
});

const nextConfig: NextConfig = {
  transpilePackages: ['firebase'],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default pwaPlugin(nextConfig);
