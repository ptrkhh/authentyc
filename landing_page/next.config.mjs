/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable file watching for WSL2 (Windows filesystem mounted in Linux)
  webpack: (config) => {
    config.watchOptions = {
      poll: 3000, // Check for changes every 3 seconds (less aggressive)
      aggregateTimeout: 500,
      ignored: ['**/node_modules', '**/.git', '**/.next'],
    };
    return config;
  },
};

export default nextConfig;
