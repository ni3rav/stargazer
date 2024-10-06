import { useEffect, useState } from "react"
import { Loading } from "./Loading"
import HTMLRenderer from "./HTMLRenderer"

export function FireballMap() {
  const [element, setElement] = useState(Loading())
  useEffect(() => {
    const fetchFireballMap = async () => {
      const response = await fetch("/api/fireball_map")
      const data = await response.json()
      if (data.error) {
        setElement(
          <div>
            <h2 className="text-3xl my-4 font-bold text-white">Error</h2>
            <p className="text-white">{data.error}</p>
          </div>
        )
        return
      }
      setElement(
        <HTMLRenderer htmlCode={data.html} />
      )
    }

    fetchFireballMap()
  }, [])
  return element
}