import { useState } from "react"
import { useInterval } from '../Helpers/useInterval.js' 
import { variant as variantSelector } from "../../selectors"

export const useTaskEditor = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    useInterval(() => setCurrentTime(new Date()), 1000, [currentTime]) // was 33 for 30 fps, now it is much slower on purpose
    const variant = variantSelector(), title = "Today's Tasks"
    return { currentTime, variant, title }
}