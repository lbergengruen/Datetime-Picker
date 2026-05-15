/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Prevent static generation of pages that use server-side data
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
