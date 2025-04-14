import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useRedirectIfUnauthorized = (user, loading) => {
  const router = useRouter()
  useEffect(() => {
    if (loading) return
    if (user === null && !loading) router.push('/')
  }, [user, loading, router])
}