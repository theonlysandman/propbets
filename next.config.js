/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporary development speedups. Revert before production.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
