import type { NextConfig } from "next";

const apiURL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://techpub-platform.onrender.com' : 'http://localhost:5000')
const allowedImageHosts = [
  'picsum.photos',
  new URL(apiURL).hostname,
].filter(Boolean)

const nextConfig: NextConfig = {
  images: {
    remotePatterns: allowedImageHosts.map((hostname) => ({
      protocol: hostname === 'localhost' ? 'http' : 'https',
      hostname,
      ...(hostname === 'localhost' ? { port: '5000' } : {}),
      pathname: '/**',
    })),
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
