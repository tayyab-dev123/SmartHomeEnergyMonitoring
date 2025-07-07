"use client";

import { useState } from "react";
import DeviceList from "@/components/dashboard/device-list";
import EnergyChart from "@/components/dashboard/energy-chart";
import ChatInterface from "@/components/dashboard/chat-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Welcome to your Energy Dashboard</h2>

      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Devices & Usage</TabsTrigger>
          <TabsTrigger value="assistant">Energy Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DeviceList onDeviceSelect={setSelectedDevice} />
            <EnergyChart
              deviceId={selectedDevice?.id}
              deviceName={selectedDevice?.name}
            />
          </div>
        </TabsContent>

        <TabsContent value="assistant">
          <ChatInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
}
