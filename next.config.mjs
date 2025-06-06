/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        swcPlugins: [["next-superjson-plugin", {}]]
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '/**',
          },
        ],
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
