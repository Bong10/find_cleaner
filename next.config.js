// next.config.js

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://217.154.36.63/";
const { protocol, hostname, port } = new URL(apiUrl);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: protocol.replace(":", ""),
        hostname: hostname,
        // port: port,
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;
