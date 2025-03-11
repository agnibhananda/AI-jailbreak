import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Vercel build pe ESLint ignore karega
  },
}

export default nextConfig
