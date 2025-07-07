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
    <Card className="gradient-card shadow-glow h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          Energy Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about your energy usage in natural language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] mb-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-900/50">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">
                Ask me anything about your energy usage!
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                <p className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  "How much energy did my AC use yesterday?"
                </p>
                <p className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  "What's my highest consuming device today?"
                </p>
                <p className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  "Show me my total usage last week"
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  } animate-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p
                      className={
                        message.type === "user"
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200"
                      }
                    >
                      {message.content}
                    </p>
                    {message.data && message.data.deviceBreakdown && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
                          Device Breakdown:
                        </p>
                        <div className="space-y-1">
                          {Object.entries(message.data.deviceBreakdown).map(
                            ([device, usage]) => (
                              <div
                                key={device}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-600 dark:text-gray-400">
                                  • {device}
                                </span>
                                <span className="font-mono font-medium text-gray-800 dark:text-gray-200">
                                  {usage} kWh
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        {message.data.totalUsage && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-gray-700 dark:text-gray-300">
                                Total:
                              </span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {message.data.totalUsage} kWh
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start animate-in">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your energy usage..."
            disabled={loading}
            className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
