import type { NextConfig } from "next";

const apiURL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'http://187.127.213.19:5000' : 'http://localhost:5000')
const parsedApiURL = new URL(apiURL)
const allowedImageHosts = [
  'picsum.photos',
  parsedApiURL.hostname,
].filter(Boolean)

const nextConfig: NextConfig = {
  // There is a second (empty) package-lock.json one level up, so Turbopack would
  // otherwise infer the repo root as the workspace and fail to resolve packages
  // that only live in frontend/node_modules (e.g. @swc/helpers).
  turbopack: {
    root: __dirname,
  },
  // Trust these hosts for dev (HMR + RSC) so the site also works when opened at
  // http://127.0.0.1:3000 or from another device on the LAN. Dev-only.
  allowedDevOrigins: ['localhost', '127.0.0.1', '187.127.213.19'],
  images: {
    remotePatterns: [
      ...allowedImageHosts.map((hostname) => ({
        protocol: (parsedApiURL.protocol.replace(':', '') || 'https') as 'http' | 'https',
        hostname,
        ...(hostname === parsedApiURL.hostname && parsedApiURL.port ? { port: parsedApiURL.port } : {}),
        pathname: '/**',
      })),
      // Supabase Storage (in case media ever resolves to a direct bucket URL).
      { protocol: 'https' as const, hostname: '**.supabase.co', pathname: '/**' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
