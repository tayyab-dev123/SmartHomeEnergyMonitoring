"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      const assistantMessage = {
        type: "assistant",
        content: data.summary,
        data: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Assistant</CardTitle>
        <CardDescription>
          Ask questions about your energy usage in natural language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4 p-4 border rounded">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-center">
              <p>Try asking:</p>
              <p className="text-sm mt-2">
                "How much energy did my AC use yesterday?"
              </p>
              <p className="text-sm">
                "What's my highest consuming device today?"
              </p>
              <p className="text-sm">"Show me my total usage last week"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.data && message.data.deviceBreakdown && (
                      <div className="mt-2 text-sm">
                        <p className="font-semibold">Device Breakdown:</p>
                        {Object.entries(message.data.deviceBreakdown).map(
                          ([device, usage]) => (
                            <p key={device}>
                              • {device}: {usage} kWh
                            </p>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your energy usage..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
