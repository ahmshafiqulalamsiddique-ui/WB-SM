/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure for Coolify/Docker deployment
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Enable compression
  compress: true,
  // Optimize for production
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig