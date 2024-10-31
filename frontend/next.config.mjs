/** @type {import('next').NextConfig} */
import withLlamaIndex from "llamaindex/next";
import webpack from "./webpack.config.mjs";
import createMDX from '@next/mdx';

const nextConfig = {
  images: {
    unoptimized: true     // Disable image optimization if needed
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],  // Add support for more file types
  webpack,  // Custom webpack configuration
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Apply withLlamaIndex to add necessary modifications
export default withMDX(withLlamaIndex(nextConfig));
