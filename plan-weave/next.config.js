/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // TODO: Figure out how to get the dnd to work with this true
  images: {
    // cache optimized images for 60 seconds    
    minimumCacheTTL: 60,  // https://www.codemotion.com/magazine/frontend/optimize-next-js-for-production/
  },
}

module.exports = nextConfig
