import { useEffect } from 'react'

export const useInterval = (callback, delay, dependencies) => {
  useEffect(() => {
    const interval = setInterval(callback, delay)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay, ...dependencies])
}
export default useInterval
// Example usage: useInterval(() => update(), 50, [taskList])