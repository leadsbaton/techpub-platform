import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trust these hosts for dev (HMR WebSocket + RSC). Without this, visiting the
  // admin at http://127.0.0.1:5000 (instead of localhost) fails the HMR handshake
  // and the admin app never hydrates — a blank/black screen. Add your LAN IP here
  // too if you open the dev admin from another device. Dev-only; no prod effect.
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Ensure proper module resolution for ALL payload config import patterns
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
      '@/payload.config': path.resolve(__dirname, 'src/payload.config.ts'),
      'payload.config': path.resolve(__dirname, 'src/payload.config.ts'),
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
