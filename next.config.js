// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // protocol: 'http',
        // hostname: '192.168.1.103',
        // hostname: '127.0.0.1',
        hostname: 'cgsabiozard.co.uk',
        // port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;
