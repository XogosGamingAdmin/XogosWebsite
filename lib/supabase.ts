import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for server-side operations
 * Uses the service role key for full access to storage
 */
export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

/**
 * Get the public URL for an image stored in Supabase Storage
 * @param storagePath - The full storage path (e.g., 'blog-images/abc123.jpg')
 */
export function getPublicImageUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }
  return `${supabaseUrl}/storage/v1/object/public/${storagePath}`;
}

/**
 * Storage bucket name for blog images
 */
export const BLOG_IMAGES_BUCKET = "blog-images";
