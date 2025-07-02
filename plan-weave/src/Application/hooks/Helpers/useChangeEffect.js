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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
const shallowEqualArray = (a, b) => a.length === b.length && a.every((val, i) => val === b[i])