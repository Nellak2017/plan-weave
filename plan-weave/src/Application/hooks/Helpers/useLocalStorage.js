import { useState, useEffect } from 'react'

export const useLocalStorage = (key, fallback = 'dark') => {
    const [value, setValue] = useState(fallback)
    useEffect(() => {
        setValue((localStorage.getItem(key) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')))
        const handleStorageChange = () => setValue(localStorage.getItem(key) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])
    return { value, setValue: val => { localStorage.setItem(key, val); window.dispatchEvent(new Event('storage')) } }
}