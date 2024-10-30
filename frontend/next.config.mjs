/** @type {import('next').NextConfig} */
import withLlamaIndex from "llamaindex/next";
import webpack from "./webpack.config.mjs";

const nextConfig = {
  images: {
    unoptimized: true     // Disable image optimization if needed
  },
  webpack,  // Custom webpack configuration
};

// Apply withLlamaIndex to add necessary modifications
export default withLlamaIndex(nextConfig);
