import { useState, useEffect } from 'react'

const lightDarkSwitch = oldMode => oldMode === 'light' ? 'dark' : 'light'
const getInitialMode = () => {
    if (typeof window === 'undefined') return 'dark'
    if (localStorage.getItem('themeMode')) return localStorage.getItem('themeMode')
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
const setModeProperly = (oldMode, setter) => {
    const newMode = lightDarkSwitch(oldMode)
    localStorage.setItem('themeMode', newMode)
    window.dispatchEvent(new Event('storage')) // see also: https://michalkotowski.pl/writings/how-to-refresh-a-react-component-when-local-storage-has-changed
    setter(newMode)
}
export const usePreferredTheme = () => {
    const [mode, setMode] = useState(getInitialMode())
    useEffect(() => {
        const handleStorageChange = () => setMode(localStorage.getItem('themeMode'))
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
      }, [])
    return { mode, setModeProperly: () => setModeProperly(mode, setMode) }
}