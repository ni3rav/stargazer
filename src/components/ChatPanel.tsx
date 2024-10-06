"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "model";
  content: string;
};

type SendChatResp = {
  message?: string;
  error?: string;
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage: Message = { content: input, role: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      setLoading(true);
      const response = await fetch("/api/chat/send", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          message: input,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonResp: SendChatResp = await response.json();

      const botMessage: Message = {
        role: "model",
        content:
          jsonResp.message ||
          jsonResp.error ||
          "An unexpected error occurred, please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getChat = async () => {
      try {
        const resp = await fetch("/api/chat/list", {
          method: "GET",
          credentials: "include",
        });
        const jsonResp: Message[] = await resp.json();

        setMessages(jsonResp);
      } catch (err) {
        console.error(err);
      }
    };

    getChat();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-zinc-900 rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-zinc-100 ml-auto"
                  : "bg-zinc-800 text-zinc-100"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="p-4 bg-zinc-800 border-t border-zinc-700">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-700 text-zinc-100 border-zinc-600 focus:ring-blue-500 placeholder-zinc-400"
          />
          <Button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-zinc-100 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-zinc-800"
          >
            {loading ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
