/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'umbra-digital.sgp1.digitaloceanspaces.com'
      },
      // temporary
      {
        protocol: 'https',
        hostname: 's3-alpha-sig.figma.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000'
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com'
      },
      {
        protocol: 'https',
        hostname: 'general-platform-staging-api-x8j75.ondigitalocean.app'
      }
    ]
  }
}

module.exports = nextConfig
