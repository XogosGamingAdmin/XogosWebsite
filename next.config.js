/** @type {import('next').NextConfig} */
const buildTime = Date.now();

module.exports = {
  reactStrictMode: true,
  // Force new build ID to bust cache every deployment
  generateBuildId: async () => {
    return `build-${buildTime}`;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    // Explicitly expose these env vars to the server runtime
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // Database environment variables
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_SSL: process.env.DATABASE_SSL,
    // Liveblocks
    LIVEBLOCKS_SECRET_KEY: process.env.LIVEBLOCKS_SECRET_KEY,
  },
  images: {
    domains: ["liveblocks.io", "static.wixstatic.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Force completely new chunk filenames every build
      const originalFilename = config.output.filename;
      const originalChunkFilename = config.output.chunkFilename;

      config.output.filename = originalFilename.replace('[name]', `[name]-${buildTime}`);
      config.output.chunkFilename = originalChunkFilename.replace('[name]', `[name]-${buildTime}`);
    }
    return config;
  },
};
