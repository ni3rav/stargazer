import { useEffect, useState } from "react"
import { Loading } from "./Loading"
import { HoverEffect } from "./ui/card-hover-effect"


export function LaunchesBoard() {
  const [element, setElement] = useState(Loading())
  useEffect(() => {
    const fetchLaunches = async () => {
      const response = await fetch("/api/launches")
      const data = await response.json()
      setElement(
        <HoverEffect items={data} />
      )
    }

    fetchLaunches()
  }, [])
  return element
}