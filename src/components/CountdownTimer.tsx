import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ShiftingCountdown = ({ from_date }: { from_date: string }) => {
  return (
    <div>
      <div className="mx-auto flex max-w-3xl items-center bg-white">
        <CountdownItem unit="Day" text="days" from_datetime={from_date} />
        <CountdownItem unit="Hour" text="hours" from_datetime={from_date} />
        <CountdownItem unit="Minute" text="minutes" from_datetime={from_date} />
        <CountdownItem unit="Second" text="seconds" from_datetime={from_date} />
      </div>
    </div>
  );
};

const CountdownItem = ({ unit, text, from_datetime }: { unit: string, text: string, from_datetime: string }) => {
  const { ref, time } = useTimer(unit, from_datetime);

  return (
    <div className="flex h-16 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono md:h-24 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-lg font-medium text-black md:text-2xl lg:text-4xl xl:text-5xl"
        >
          {time}
        </span>
      </div>
      <span className="text-xs font-light text-slate-500 md:text-sm lg:text-base">
        {text}
      </span>
    </div>
  );
};

export default ShiftingCountdown;

// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations
const useTimer = (unit: string, from_datetime: string) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef(0);

  const [time, setTime] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = async () => {
    const end = new Date(from_datetime);
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === "Day") {
      newTime = Math.floor(distance / DAY);
    } else if (unit === "Hour") {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
};