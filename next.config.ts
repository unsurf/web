import type { NextConfig } from "next";

const OPENINVENTORY_ORIGIN = "https://openinventory.unsurf.sh";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.ts.net", "100.69.14.72"],
  async redirects() {
    return [
      {
        source: "/openinventory/:path*",
        destination: `${OPENINVENTORY_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
