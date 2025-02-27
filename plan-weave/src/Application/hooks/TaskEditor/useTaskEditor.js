import { useState } from "react"
import { useInterval } from '../Helpers/useInterval.js' 
import { variant as variantSelector } from "../../selectors"

export const useTaskEditor = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    useInterval(() => setCurrentTime(new Date()), 33, [currentTime])
    const variant = variantSelector(), title = "Today's Tasks"
    return { currentTime, variant, title }
}