"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { FireballMap } from "./FireballMap";
import { POTD } from "./POTD";
import { EventsBoard } from "./EventsBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LaunchesBoard } from "./LaunchesBoard";
import { ChatPanel } from "./ChatPanel";
import { ConstellationMap } from "./ConstellationMap";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Menu } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("potd");

  const tabItems = [
    { value: "potd", label: "APOD" },
    { value: "fireball_map", label: "Fireball Map" },
    { value: "events", label: "Events" },
    { value: "launches", label: "Launches" },
    { value: "chat", label: "Chat" },
    { value: "constellation_map", label: "Constellation Map" },
  ];

  const TabTriggers = () => (
    <>
      {tabItems.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          className="px-4 py-2 text-center"
          onClick={() => setActiveTab(item.value)}
        >
          {item.label}
        </TabsTrigger>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-4">
      <div className="w-full max-w-7xl mx-auto px-4">
        <Tabs value={activeTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Home className="h-6 w-6" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4">
                    <TabsList className="h-auto flex-col items-stretch">
                      <TabTriggers />
                    </TabsList>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:flex md:flex-grow md:justify-center">
              <TabsList className="h-auto flex-wrap justify-center items-center">
                <TabTriggers />
              </TabsList>
            </div>
          </div>
          <div className="w-full">
            <TabsContent value="potd">
              <POTD />
            </TabsContent>
            <TabsContent value="fireball_map">
              <FireballMap />
            </TabsContent>
            <TabsContent value="events">
              <EventsBoard />
            </TabsContent>
            <TabsContent value="launches">
              <LaunchesBoard />
            </TabsContent>
            <TabsContent value="chat">
              <ChatPanel />
            </TabsContent>
            <TabsContent value="constellation_map">
              <ConstellationMap />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}