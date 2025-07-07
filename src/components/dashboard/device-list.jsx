"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeviceList({ onDeviceSelect }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    try {
      const response = await fetch("/api/devices");
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeviceClick = (device) => {
    setSelectedDevice(device.id);
    onDeviceSelect(device);
  };

  if (loading) {
    return (
      <Card className="gradient-card shadow-glow">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDeviceIcon = (type) => {
    switch (type) {
      case "AC":
        return (
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "Refrigerator":
        return (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );
      case "Heater":
        return (
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
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
          </svg>
        );
      case "Computer":
        return (
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
    }
  };

  return (
    <Card className="gradient-card shadow-glow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Your Devices</CardTitle>
        <CardDescription>
          Select a device to view detailed energy consumption
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`
                relative p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${
                  selectedDevice === device.id
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-500 shadow-md"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                }
              `}
              onClick={() => handleDeviceClick(device)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${
                      selectedDevice === device.id
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }
                  `}
                  >
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {device.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {device.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      device.telemetry[0]?.energyWatts > 1000
                        ? "destructive"
                        : "secondary"
                    }
                    className="font-mono"
                  >
                    {device.telemetry[0]?.energyWatts?.toFixed(1) || 0}W
                  </Badge>
                  {selectedDevice === device.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
