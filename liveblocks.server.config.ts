import { Liveblocks } from "@liveblocks/node";
import { getProviders } from "@/auth";

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

(async () => {
  const providers = await getProviders();

  if (providers?.google) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.log(`Your Google secrets are missing from .env.local

Example .env.local file:
GOOGLE_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Follow the full starter kit guide to learn how to get them:
https://liveblocks.io/docs/guides/nextjs-starter-kit#google-authentication
      `);
    }
  }

  if (providers?.github) {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      console.log(`Your GitHub secrets are missing from .env.local

Example .env.local file:
GITHUB_CLIENT_ID=sk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GITHUB_CLIENT_SECRET=sk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Follow the full starter kit guide to learn how to get them:
https://liveblocks.io/docs/guides/nextjs-starter-kit#github-authentication
      `);
    }
  }

  if (providers?.auth0) {
    if (
      !process.env.AUTH0_CLIENT_ID ||
      !process.env.AUTH0_CLIENT_SECRET ||
      !process.env.AUTH0_ISSUER_BASE_URL
    ) {
      throw new Error(`Your Auth0 secrets are missing from .env.local

Example .env.local file:
AUTH0_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AUTH0_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AUTH0_ISSUER_BASE_URL=https://XXXXXXXXXXXXXXXXXX.com

Follow the full starter kit guide to learn how to get them:
https://liveblocks.io/docs/guides/nextjs-starter-kit#auth0-authentication
      `);
    }
  }
})();
