/** @type {import('next').NextConfig} */
const nextConfig = {
  // jsdom has ESM-only transitive deps that break when bundled by Next.js.
  // Exclude it from bundling so Node.js resolves it natively at runtime.
  serverExternalPackages: ["jsdom"],

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
