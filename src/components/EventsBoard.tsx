import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { HoverEffectEvent } from "./ui/event-card";

export function EventsBoard() {
  const [element, setElement] = useState(Loading());
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data = await response.json();
      setElement(
        <HoverEffectEvent items={data} />
      );
    };

    fetchEvents();
  }, []);
  return element;
}
