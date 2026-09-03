import { createBrowserClient } from '@supabase/ssr'

// This creates a single supabase client for the entire browser-side app
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)