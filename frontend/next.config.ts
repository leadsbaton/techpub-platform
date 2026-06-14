import type { NextConfig } from "next";

const apiURL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://techpub-platform.onrender.com' : 'http://localhost:5000')
const allowedImageHosts = [
  'picsum.photos',
  new URL(apiURL).hostname,
].filter(Boolean)

const nextConfig: NextConfig = {
  // Trust these hosts for dev (HMR + RSC) so the site also works when opened at
  // http://127.0.0.1:3000 or from another device on the LAN. Dev-only.
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      ...allowedImageHosts.map((hostname) => ({
        protocol: (hostname === 'localhost' ? 'http' : 'https') as 'http' | 'https',
        hostname,
        ...(hostname === 'localhost' ? { port: '5000' } : {}),
        pathname: '/**',
      })),
      // Supabase Storage (in case media ever resolves to a direct bucket URL).
      { protocol: 'https' as const, hostname: '**.supabase.co', pathname: '/**' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
