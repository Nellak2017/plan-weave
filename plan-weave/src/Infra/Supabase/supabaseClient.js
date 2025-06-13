import { createClient } from '@supabase/supabase-js'
import { createServerClient, serializeCookieHeader } from '@supabase/ssr'
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://d.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "d")
export const createAPIClient = (req, res) => createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
        getAll() { return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || '' })) },
        setAll(cookiesToSet) { res.setHeader('Set-Cookie', cookiesToSet.map(({ name, value, options }) => serializeCookieHeader(name, value, options))) }
    }
})