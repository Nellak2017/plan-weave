/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // TODO: Figure out how to get the dnd to work with this true
  images: {
    // cache optimized images for 60 seconds    
    minimumCacheTTL: 60,  // https://www.codemotion.com/magazine/frontend/optimize-next-js-for-production/
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // "same-origin-allow-popups"
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          }
        ],
      },
    ]
  }, // This eliminates the Google Sign-in / Sign-up error where it says the Cross Origin is disallowed
}

module.exports = nextConfig
