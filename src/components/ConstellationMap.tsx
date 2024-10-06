import { useEffect, useState } from "react"
import { Loading } from "./Loading"
import HTMLRenderer from "./HTMLRenderer"

export function ConstellationMap() {
	const [element, setElement] = useState(Loading())
	useEffect(() => {
		const fetchConstellationMap = async () => {
			const response = await fetch("/constellation_map.html")
			const htmlFile = await response.text()
			setElement(
				<HTMLRenderer htmlCode={htmlFile} />
			)
		}

	fetchConstellationMap()
	}, [])
	return element
}