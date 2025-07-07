"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format } from "date-fns";

export default function EnergyChart({ deviceId, deviceName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (deviceId) {
      fetchTelemetryData();
    }
  }, [deviceId]);

  async function fetchTelemetryData() {
    try {
      const response = await fetch(
        `/api/telemetry?deviceId=${deviceId}&days=7`
      );
      const telemetryData = await response.json();

      // Group data by hour for better visualization
      const hourlyData = telemetryData.reduce((acc, reading) => {
        const hour = format(new Date(reading.timestamp), "MMM dd HH:00");
        if (!acc[hour]) {
          acc[hour] = { hour, totalWatts: 0, count: 0 };
        }
        acc[hour].totalWatts += reading.energyWatts;
        acc[hour].count += 1;
        return acc;
      }, {});

      const chartData = Object.values(hourlyData).map((item) => ({
        time: item.hour,
        watts: Math.round(item.totalWatts / item.count),
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching telemetry:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!deviceId) {
    return (
      <Card className="gradient-card shadow-glow">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Energy Usage</CardTitle>
          <CardDescription>
            Select a device to view its energy consumption patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              No device selected
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="gradient-card shadow-glow">
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {payload[0].value}W
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="gradient-card shadow-glow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {deviceName} - Energy Usage
        </CardTitle>
        <CardDescription>
          Hourly average consumption over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWatts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#6B7280" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
              label={{
                value: "Watts",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 14 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="watts"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWatts)"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {data.length > 0
                ? Math.round(
                    data.reduce((sum, item) => sum + item.watts, 0) /
                      data.length
                  )
                : 0}
              W
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Minimum</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {data.length > 0 ? Math.min(...data.map((d) => d.watts)) : 0}W
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400">Maximum</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {data.length > 0 ? Math.max(...data.map((d) => d.watts)) : 0}W
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
