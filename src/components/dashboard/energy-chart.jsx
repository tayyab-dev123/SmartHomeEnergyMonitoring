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
        watts: item.totalWatts / item.count,
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
      <Card>
        <CardHeader>
          <CardTitle>Energy Usage</CardTitle>
          <CardDescription>
            Select a device to view its energy consumption
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return <div>Loading chart...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{deviceName} - Energy Usage</CardTitle>
        <CardDescription>Last 7 days hourly average</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="watts"
              stroke="#8884d8"
              name="Watts"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
