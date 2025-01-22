import { useEffect } from 'react'

/**
 * Custom hook to execute a callback function on a specified interval.
 *
 * @param {Function} callback - The function to be executed on the interval.
 * @param {number} delay - The interval duration in milliseconds.
 * @param {Array} dependencies - Dependencies that trigger the interval when changed.
 */
export const useInterval = (callback, delay, dependencies) => {
  useEffect(() => {
    const interval = setInterval(callback, delay)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay, ...dependencies])
}

export default useInterval

// Example usage:
// useInterval(() => update(), 50, [taskList])