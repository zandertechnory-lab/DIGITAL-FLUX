/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'],
  },
}

module.exports = nextConfig

