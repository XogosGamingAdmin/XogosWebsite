import { Liveblocks } from "@liveblocks/node";

// Your Liveblocks secret key
export const SECRET_API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

// ============================================================================
if (typeof window !== "undefined") {
  console.log();
  console.error(
    "DANGER: You're using data from /liveblocks.server.config.ts on the client"
  );
  console.error("This may expose your secret key(s)");
  console.log();
}

// Check for secret key - only warn during build, error at runtime
if (!SECRET_API_KEY) {
  const isBuilding = process.env.NEXT_PHASE === 'phase-production-build';

  if (isBuilding) {
    console.warn('\n⚠️  WARNING: LIVEBLOCKS_SECRET_KEY not set during build.');
    console.warn('⚠️  Using placeholder for build. Set environment variable for production.\n');
  } else if (process.env.NODE_ENV === 'production') {
    // Only throw error at runtime in production, not during build
    throw new Error(`You must add your Liveblocks secret key to environment variables

Example environment variable:
LIVEBLOCKS_SECRET_KEY=sk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

You can find your secret keys on https://liveblocks.io/dashboard/apikeys
Follow the full starter kit guide on https://liveblocks.io/docs/guides/nextjs-starter-kit

`);
  }
}

// Initialize Liveblocks with fallback for build time
// At runtime, this will use the real key from environment variables
export const liveblocks = new Liveblocks({
  secret: SECRET_API_KEY || 'sk_dev_placeholder_for_build_replace_with_real_key_in_production'
});
