/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'wrapped-images.spotifycdn.com'],
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig 