import { useEffect, useRef } from 'react'

/**
 * Like useEffect, but:
 * - Skips first render
 * - Runs only when deps actually change (not just re-rendered)
 */
export const useChangeEffect = (effectFn, deps) => {
    const hasMountedRef = useRef(false), prevDepsRef = useRef(deps)
    useEffect(() => {
        if (!hasMountedRef.current) { hasMountedRef.current = true; prevDepsRef.current = deps; return }
        if (!shallowEqualArray(prevDepsRef.current, deps)) { prevDepsRef.current = deps; effectFn() }
    }, deps)
}
const shallowEqualArray = (a, b) => { // Compare shallow values of deps
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) return false }
    return true
}