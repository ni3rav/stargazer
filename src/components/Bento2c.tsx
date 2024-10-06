"use client";

import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function Bento2c() {
  return (
    <section className="min-h-screen relative w-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden py-12 px-4">
      <div className="absolute inset-0">
        <ShootingStars />
        <StarsBackground />
      </div>
      <div className="text-zinc-100 z-10 flex flex-col justify-center items-center gap-6 w-full max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-black">
          Features
        </h1>
        <BentoGrid className="w-full grid-cols-1 md:grid-cols-3 auto-rows-auto md:auto-rows-[20rem] gap-4">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

type HeaderImageProps = {
  source: string;
};

const HeaderImage = ({ source }: HeaderImageProps) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-white/[0.2] bg-black overflow-hidden">
    <img
      src={source}
      alt="Feature preview"
      className="w-full h-full object-cover"
    />
  </div>
);

const items = [
  {
    title: "Interactive Fireball Map",
    description: "Visualize where the asteroids have fallen upon the Earth.",
    header: <HeaderImage source="/fireball_map_demo.png" />,
    className: "md:col-span-2",
  },
  {
    title: "Be in the loop",
    description: "Keep up with the latest astronomy events.",
    header: <HeaderImage source="/events_demo.png" />,
    className: "md:col-span-1",
  },
  {
    title: "T-3, T-2, T-1, ...",
    description: "That rocket is launching sooooon.",
    header: <HeaderImage source="/launches_demo.png" />,
    className: "md:col-span-1",
  },
  {
    title: "Intelligent chatbot",
    description: "Ask anything you want to know about the night sky.",
    header: <HeaderImage source="/chatbot_demo.png" />,
    className: "md:col-span-2",
  },
];
