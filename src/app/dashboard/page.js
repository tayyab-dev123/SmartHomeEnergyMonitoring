"use client";

import { useState } from "react";
import DeviceList from "@/components/dashboard/device-list";
import EnergyChart from "@/components/dashboard/energy-chart";
import ChatInterface from "@/components/dashboard/chat-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import Card components
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <div className="space-y-6">
      <div className="animate-in">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          Welcome to your Energy Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor your devices and track energy consumption in real-time
        </p>
      </div>

      <Tabs
        defaultValue="devices"
        className="space-y-6 animate-in"
        style={{ animationDelay: "0.1s" }}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="devices"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            Devices & Usage
          </TabsTrigger>
          <TabsTrigger
            value="assistant"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Energy Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="animate-in" style={{ animationDelay: "0.2s" }}>
              <DeviceList onDeviceSelect={setSelectedDevice} />
            </div>
            <div className="animate-in" style={{ animationDelay: "0.3s" }}>
              <EnergyChart
                deviceId={selectedDevice?.id}
                deviceName={selectedDevice?.name}
              />
            </div>
          </div>

          {selectedDevice && (
            <div
              className="grid gap-6 lg:grid-cols-3 animate-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Card className="gradient-card shadow-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current Power
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedDevice.telemetry[0]?.energyWatts?.toFixed(1) ||
                          0}
                        W
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card shadow-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Device Type
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedDevice.type}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card shadow-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        Active
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <div
            className="max-w-4xl mx-auto animate-in"
            style={{ animationDelay: "0.2s" }}
          >
            <ChatInterface />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
