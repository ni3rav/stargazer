"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const HoverEffectEvent = ({
  items,
  className,
}: {
  items: {
    name: string
    image: string
    description: string
    news_url?: string
    video_url?: string
  }[]
  className?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [summarizing, setSummarizing] = useState<number | null>(null)
  const [summaries, setSummaries] = useState<string[]>(new Array(items.length).fill(""))

  const handleSummarize = async (url: string, index: number) => {
    setSummarizing(index)
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      setSummaries(prevSummaries => {
        const newSummaries = [...prevSummaries]
        newSummaries[index] = data.summary
        return newSummaries
      })
    } catch (error) {
      console.error("Error summarizing content:", error)
      setSummaries(prevSummaries => {
        const newSummaries = [...prevSummaries]
        newSummaries[index] = "Failed to summarize content. Please try again."
        return newSummaries
      })
    } finally {
      setSummarizing(null)
    }
  }

  const getYouTubeThumbnail = (url: string) => {
    const split = url.split('/')
    const videoId = split[split.length - 1]
    return `https://img.youtube.com/vi/${videoId}/0.jpg`
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>
              <div>
                <img src={item.image} alt={item.name} className="m-2 w-full h-48 object-cover rounded-lg" />
                <p>{item.description}</p>
              </div>
            </CardDescription>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 mx-auto">Check it out</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{item.name}</DialogTitle>
                  <DialogDescription>
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <p>{item.description}</p>
                    {item.news_url && (
                      <div className="mt-4">
                        <a href={item.news_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          Read the news
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleSummarize(item.news_url!, idx)}
                          disabled={summarizing === idx}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {summarizing === idx ? "Summarizing..." : "Summarize"}
                        </Button>
                      </div>
                    )}
                    {summaries[idx] && (
                      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Summary:</h4>
                        <p>{summaries[idx]}</p>
                      </div>
                    )}
                    {item.video_url && (
                      <div className="mt-4">
                        <div className="relative">
                          <img 
                            src={getYouTubeThumbnail(item.video_url)} 
                            alt={`Thumbnail for ${item.name}`} 
                            className="w-full rounded-lg"
                          />
                          <a 
                            href={item.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg"
                          >
                            <ExternalLink className="w-12 h-12" />
                          </a>
                        </div>
                        <p className="mt-2 text-sm text-center">
                          Click to watch the video on YouTube
                        </p>
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      ))}
    </div>
  )
}

export const Card = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export const CardTitle = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  )
}

export const CardDescription = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </div>
  )
}