/** @type {import('next').NextConfig} */
import withLlamaIndex from "llamaindex/next";
import webpack from "./webpack.config.mjs";
import createMDX from '@next/mdx'

const nextConfig = {
  images: {
    unoptimized: true     // Disable image optimization if needed
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack,  // Custom webpack configuration
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.mdx?$/,
})

// Apply withLlamaIndex to add necessary modifications
export default withMDX(withLlamaIndex(nextConfig));
