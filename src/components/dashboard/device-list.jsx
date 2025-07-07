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

  if (loading) {
    return <div>Loading devices...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Devices</CardTitle>
        <CardDescription>
          Click on a device to view its energy usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent"
              onClick={() => onDeviceSelect(device)}
            >
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-sm text-muted-foreground">{device.type}</p>
              </div>
              <Badge variant="outline">
                {device.telemetry[0]?.energyWatts?.toFixed(1) || 0}W
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
