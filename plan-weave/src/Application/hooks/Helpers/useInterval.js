import { useEffect, useRef } from 'react'

export const useInterval = (callback, delay, dependencies) => {
  const savedCallback = useRef()
  useEffect(() => { savedCallback.current = callback }, [callback])
  useEffect(() => {
    if (typeof delay !== 'number' || delay <= 0) return
    const tick = () => savedCallback.current?.()
    const interval = setInterval(tick, delay)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay])
}
export default useInterval
// Example usage: useInterval(() => update(), 50, [taskList])