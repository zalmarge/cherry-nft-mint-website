/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.hubspot.net',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };

export default nextConfig;
