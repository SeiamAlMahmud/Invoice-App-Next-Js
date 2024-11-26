import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'en.wikipedia.org',
        pathname: '/static/images/icons/*', // You can add specific paths if necessary
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/u/*', // You can adjust this based on the URL structure
      },
    ],
  },
};

export default nextConfig;
