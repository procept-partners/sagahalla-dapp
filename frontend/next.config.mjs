/** @type {import('next').NextConfig} */
import withLlamaIndex from "llamaindex/next";
import webpack from "./webpack.config.mjs";

// Base Next.js config options (move everything from the json file into this config)
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/*": [
        "./cache/**/*"
      ]
    },
    outputFileTracingExcludes: {
      "/api/files/*": [
        ".next/**/*",
        "node_modules/**/*",
        "public/**/*",
        "app/**/*"
      ]
    }
  },
  output: 'export',       // Keep static export configuration
  images: {
    unoptimized: true     // Disable image optimization if needed
  },
  webpack,  // Custom webpack configuration
  
  // Add rewrites to proxy API requests to FastAPI
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to FastAPI running on port 8000
      },
    ]
  },
};

// Apply withLlamaIndex to add necessary modifications
export default withLlamaIndex(nextConfig);
