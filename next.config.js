/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `http://192.168.0.111/:path*`,
        },
      ],
    }
  },
}

module.exports = nextConfig
