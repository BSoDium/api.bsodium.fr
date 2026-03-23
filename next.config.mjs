/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: remove once all consumers have migrated away from /api/* routes
  async redirects() {
    return [
      {
        source: "/api/:path*",
        destination: "/:path*",
        permanent: false, // 307 — change to true (308) once migration is complete
      },
    ];
  },
};

export default nextConfig;
