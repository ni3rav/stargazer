import { useEffect, useState } from "react";
import { Loading } from "./Loading";

export function POTD() {
  const [element, setElement] = useState(Loading());
  useEffect(() => {
    const fetchPOTD = async () => {
      const response = await fetch("/api/potd");
      const data = await response.json();
      setElement(
        <>
          <div className="grid grid-cols-2 grid-rows-10 gap-2 md:grid-cols-10 md:grid-rows-8 md:gap-2 size-full">
            {/* !md and after */}
            <div className="col-span-10 md:flex justify-center items-center md:visible hidden">
              <h1 className="text-5xl py-4 px-6 font-extrabold">
                {data.title}
              </h1>
            </div>
            <div className="col-span-4 row-span-7 row-start-2 hidden md:visible  md:flex justify-center items-center p-2">
              <img
                src={data.url}
                alt={data.title}
                className="size-full object-cover"
              />
            </div>

            <div className="col-span-6 row-span-7 col-start-5 row-start-2 hidden md:visible md:flex justify-start items-start py-12 pl-2 pr-8 ml-4">
              <p className="text-justify text-xl font-semibold">
                {data.description}
              </p>
            </div>
            {/* md and after */}

            {/* before md */}
            <div className="col-span-2 md:hidden  visible flex justify-center items-center">
              <h1 className="text-4xl p-2 font-bold truncate">{data.title}</h1>
            </div>
            <div className="col-span-2 row-span-4 row-start-2 md:hidden visible flex justify-center items-center p-2">
              <img
                src={data.url}
                alt={data.title}
                className="size-[96%] object-fill"
              />
            </div>
            <div className="col-span-2 row-span-5 row-start-6 md:hidden visible flex justify-start items-start px-2 py-4 text-justify">
              <p className="font-semibold px-3">
               {data.description}
              </p>
            </div>
            {/* before md */}
          </div>
        </>
      );
    };

    fetchPOTD();
  }, []);
  return element;
}
