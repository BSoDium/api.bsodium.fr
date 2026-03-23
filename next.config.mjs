/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: remove once all consumers have migrated away from /api/* routes
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
