import { createClient } from '@supabase/supabase-js'
// TODO: Update Vercel environment variables to include the supabase stuffs
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://d.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "d")