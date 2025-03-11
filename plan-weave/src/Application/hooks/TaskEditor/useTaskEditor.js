import { useState } from "react"
import { useInterval } from '../Helpers/useInterval.js'

export const useTaskEditor = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    useInterval(() => setCurrentTime(new Date()), 1000, [currentTime]) // was 33 for 30 fps, now it is much slower on purpose
    return { currentTime, title: "Today's Tasks" }
}