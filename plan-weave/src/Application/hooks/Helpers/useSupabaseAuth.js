// TODO: Determine if it lives here or in sessionContexts or somewhere else
import { useState, useEffect } from 'react'
import { supabase } from '../../../Infra/Supabase/supabaseClient.js'

export const useSupabaseAuth = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) { setError(error) } else { setUser(session?.user || null) }
            setLoading(false)
        }
        getSession()
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
        })
        return () => { listener?.subscription.unsubscribe() }
    }, [])
    return { user, loading, error }
}